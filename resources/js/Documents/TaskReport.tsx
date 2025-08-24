import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { HeadingOne, HeadingTwo } from "./components/Heading";
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';

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

export function TaskReport() {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ textAlign: 'center', color: '#6b7280' }}>{"{HEADER PLACEHOLDER}"}</Text>
        </View>
        <View>
          <HeadingOne>RECEIVER INFORMATION</HeadingOne>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Name: </Text>{"{ASSIGNED BY (NAME)}"}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Position: </Text>{"{ASSIGNED BY (POSITION)}"}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Section: </Text>{"{ASSIGNED BY (SECTION)}"}</Text>
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Date: </Text>{"{DATE NOW}"}</Text>
        </View>
        <BlankLine />
        <Text style={[styles.text, styles.title]}>{"{TITLE}"}</Text>
        <BlankLine />
        <View>
          <HeadingOne>SENDER INFORMATION</HeadingOne>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <View>
              <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Name: </Text>{"{SENDER (NAME)}"}</Text>
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
            This task (ID: {"{ID}"}) is an {"{NORMAL/URGENT}"} team deployment. The operation is located in {"{LOCATION}"},
            at coordinates {"{COORDINATES}"}. {"{ASSIGNED BY}"} reported it from the {"{SECTION NAME}"}. The task was
            officially issued at {"{TIME}"}.
          </Text>
          <HeadingTwo>DESCRIPTION</HeadingTwo>
          <Text style={[styles.text, { textAlign: 'justify' }]}>
            {"{DESCRIPTION}"}
          </Text>
          <HeadingTwo>REQUIRED RESOURCES</HeadingTwo>
          <Table tdStyle={{ padding: 5 }} weightings={[0.8, 0.2]}>
            <TH>
              <TD>Resource</TD>
              <TD>Quantity</TD>
            </TH>
            <TR>
              <TD>Item 1</TD>
              <TD>3</TD>
            </TR>
            <TR>
              <TD>Item 2</TD>
              <TD>5</TD>
            </TR>
            <TR>
              <TD>Item 3</TD>
              <TD>1</TD>
            </TR>
          </Table>
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
