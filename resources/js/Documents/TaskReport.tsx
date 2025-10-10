import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { HeadingOne, HeadingTwo } from "./components/Heading";
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';
import { Task } from '@/types/tasks';
import { formatName } from '@/lib/utils';
import Background from './doc-bg.png';
import dayjs from 'dayjs';

const styles = StyleSheet.create({
  page: {
    padding: '1in',
    width: '6.5in',
    fontSize: 11,
  },
  header: {
    height: '2in',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    marginBottom: 8,
  },
});

const BlankLine = () => <Text style={styles.text}>{"\n"}</Text>

export function TaskReport({ task }: { task: Task }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Image src={Background} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} />
        <View style={styles.header} />
        <View>
          <HeadingOne>TASK CREATOR INFORMATION</HeadingOne>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Name: </Text>{formatName(task.creator)}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Position: </Text>{task.creator.position ?? 'CDRRMO Personnel'}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Date: </Text>{dayjs(task.finished_at).format('MMMM DD, YYYY - hh:mm A')}</Text>
        </View>
        <BlankLine />
        <Text style={[styles.text, styles.title]}>{task.title}</Text>
        <BlankLine />
        {/* <View>
          <HeadingOne>SENDER INFORMATION</HeadingOne>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <View>
              <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Name: </Text>{formatName(user)}</Text>
              <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Position: </Text>{"{SENDER (POSITION)}"}</Text>
              <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Section: </Text>{"{SENDER (SECTION)}"}</Text>
            </View>
            <View>
              <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Date Assigned: </Text>{"{DATE ASSIGNED}"}</Text>
              <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Date Started: </Text>{"{DATE STARTED}"}</Text>
              <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Date Finished: </Text>{"{DATE FINISHED}"}</Text>
            </View>
          </View>
        </View> */}

        <View>
          <HeadingOne>TASK INFORMATION</HeadingOne>
          <HeadingTwo>INCIDENT INFORMATION</HeadingTwo>
          <Text style={[styles.text, { textAlign: 'justify' }]}>
            This task <Text style={{ fontWeight: 'bold' }}>(ID: {task.id})</Text> is an <Text style={{ fontWeight: 'bold' }}>{task.priority.name}</Text> priority team deployment.
            The operation is located in <Text style={{ fontWeight: 'bold' }}>{task.location}</Text>.
            The task was officially issued on <Text style={{ fontWeight: 'bold' }}>{dayjs(task.created_at).format("MMMM DD, YYYY [at] hh:mm A")}</Text>.
          </Text>
          <HeadingTwo>DESCRIPTION</HeadingTwo>
          <Text style={[styles.text, { textAlign: 'justify' }]}>
            {task.description}
          </Text>

          
        </View>
      </Page>
      {!!task.transaction && (
        <Page size="LETTER" style={styles.page}>
          <HeadingOne>ALLOCATED RESOURCES</HeadingOne>
          {(!!task.transaction.equipment && task.transaction.equipment.length > 0) && (
            <>
              <HeadingTwo>Equipment</HeadingTwo>
              <Table tdStyle={{ padding: 5 }}>
                <TH>
                  <TD>Resource</TD>
                </TH>
                {task.transaction.equipment.map((item, i) => (
                  <TR key={i}>
                    <TD>{item.item.name}</TD>
                  </TR>
                ))}
              </Table>
            </>
          )}
          {(!!task.transaction.consumables && task.transaction.consumables.length > 0) && (
            <>
              <HeadingTwo>Equipment</HeadingTwo>
              <Table tdStyle={{ padding: 5 }} weightings={[0.6, 0.2, 0.2]}>
                <TH>
                  <TD>Resource</TD>
                  <TD>Type</TD>
                  <TD>Quantity</TD>
                </TH>
                {task.transaction.consumables.map((consumable, i) => (
                  <TR key={i}>
                    <TD>{consumable.item.name}</TD>
                    <TD>{consumable.item.type.name}</TD>
                    <TD>{Math.abs(consumable.quantity)}</TD>
                  </TR>
                ))}
              </Table>
            </>
          )}
        </Page>
      )}

      <Page size="LETTER" style={styles.page}>
        <View>
          <HeadingOne>ASSIGNED PERSONNEL</HeadingOne>
          <Table
            tdStyle={{ padding: 5 }}
            weightings={[0.5, 0.25, 0.25]}
          >
            <TH>
              <TD>Personnel</TD>
              <TD>Task Started</TD>
              <TD>Task Ended</TD>
            </TH>
            {task.personnel.map(person => (
              <>
                <TR>
                  <TD>{formatName(person)}</TD>
                  <TD>{dayjs(person.pivot.started_at).format('YYYY-MM-DD hh:mm A')}</TD>
                  <TD>{dayjs(person.pivot.finished_at).format('YYYY-MM-DD hh:mm A')}</TD>
                </TR>
                {!!person.pivot.additional_notes && (
                  <TR>
                    <TD weighting={1}>
                      <Text>
                        Note:
                        {'\n'}
                        {person.pivot.additional_notes}
                      </Text>
                    </TD>
                  </TR>
                )}
              </>
            ))}
          </Table>
        </View>
      </Page>
    </Document>
  );
}
