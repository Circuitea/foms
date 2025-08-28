import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { HeadingOne, HeadingTwo } from "./components/Heading";
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';
import { PropsWithChildren, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { formatName } from '@/lib/utils';
import { Personnel } from '@/types';
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
    border: '1 solid #6b7280',
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

export function TaskReport({ task, user, notes }: { task: Task, user: Personnel, notes: string }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ textAlign: 'center', color: '#6b7280' }}>{"{HEADER PLACEHOLDER}"}</Text>
        </View>
        <View>
          <HeadingOne>RECEIVER INFORMATION</HeadingOne>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Name: </Text>{formatName(task.creator)}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Position: </Text>{"{ASSIGNED BY (POSITION)}"}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Section: </Text>{"{ASSIGNED BY (SECTION)}"}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Date: </Text>{"{DATE NOW}"}</Text>
        </View>
        <BlankLine />
        <Text style={[styles.text, styles.title]}>{task.title}</Text>
        <BlankLine />
        <View>
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
        </View>

        

        <View>
          <HeadingOne>TASK INFORMATION</HeadingOne>
          <HeadingTwo>INCIDENT INFORMATION</HeadingTwo>
          <Text style={[styles.text, { textAlign: 'justify' }]}>
            This task (ID: {task.id}) is an {task.priority.name} team deployment. The operation is located in {task.location},
            at coordinates {"{COORDINATES}"}. {formatName(task.creator)} reported it from the {"{SECTION NAME}"}. The task was
            officially issued at {dayjs(task.created_at).format("MMMM DD, YYYY hh:mm A")}.
          </Text>
          <HeadingTwo>DESCRIPTION</HeadingTwo>
          <Text style={[styles.text, { textAlign: 'justify' }]}>
            {task.description}
          </Text>

          <HeadingTwo>REQUIRED RESOURCES</HeadingTwo>
          <Table tdStyle={{ padding: 5 }} weightings={[0.8, 0.2]}>
            <TH>
              <TD>Resource</TD>
              <TD>Quantity</TD>
            </TH>
            {task.items.map((item, i) => (
              <TR key={i}>
                <TD>{item.item.name}</TD>
                <TD>{item.amount}</TD>
              </TR>
            ))}
          </Table>
        </View>

        <View>
          <HeadingOne>ADDITIONAL NOTES</HeadingOne>
            {notes.trim() === '' 
              ? (
                <Text style={[{fontStyle: 'italic'}]}>No additional notes provided.</Text>
              ) : (
                <Text style={[styles.text, {textAlign: 'justify'}]}>
                  {notes}
                </Text>
              )
            }
        </View>
        
        <View>
          <HeadingOne>LOCATION LIST</HeadingOne>
          <Table tdStyle={{ padding: 5 }} weightings={[0.8, 0.2]}>
            <TH>
              <TD>Place</TD>
              <TD>Time</TD>
            </TH>
            <TR>
              <TD>Location 1</TD>
              <TD>11:00AM</TD>
            </TR>
            <TR>
              <TD>Location 2</TD>
              <TD>11:05AM</TD>
            </TR>
            <TR>
              <TD>Location 3</TD>
              <TD>11:10AM</TD>
            </TR>
          </Table>
        </View>
      </Page>
    </Document>
  );
}
