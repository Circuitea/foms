import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { PersonnelWithLocationHistory } from "@/Pages/Mapping/Partials/GenerateLocationHistoryReportDialog";
import dayjs from "dayjs";
import { formatName } from "@/lib/utils";
import Background from './doc-bg.png';

const styles = StyleSheet.create({
  page: {
    padding: '1in',
    width: '6.5in',
    fontSize: 11,
  },
  header: {
    height: '1.5in',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: 1,
    borderBottomColor: 'black',
    paddingBottom: 4,
    marginBottom: 8
  },
  text: {
    marginBottom: 8,
  },
});

export function LocationHistoryReport({ personnel, date }: { personnel: PersonnelWithLocationHistory[], date: Date }) {
  const sorted = [...personnel].sort((a, b) => a.id - b.id).map(person => ({
    ... person,
    'location_history': [...person.location_history].sort((a, b) => dayjs(a.created_at).diff(dayjs(b.created_at))),
  }));
  
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Image src={Background} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} />
        <View style={styles.header} />
        <View style={styles.title}>
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Location History</Text>
          <Text style={{ textAlign: 'right' }}>{dayjs(date).format('MMMM DD, YYYY')}</Text>
        </View>
        <Table
          tdStyle={{ padding: 5 }}
          weightings={[0.5, 0.25, 0.25]}
        >
          <TH>
            <TD>Personnel</TD>
            <TD>Start Time</TD>
            <TD>End Time</TD>
          </TH>
          {sorted.map(person => (
            <TR>
              <TD>{formatName(person)}</TD>
              <TD>{dayjs(person.location_history[0].created_at).format('hh:mm A')}</TD>
              <TD>{dayjs(person.location_history[person.location_history.length-1].created_at).format('hh:mm A')}</TD>
            </TR>
          ))}
        </Table>
      </Page>
      {sorted.map((person, index) => (
        <Page key={index} size="LETTER" style={styles.page}>
          <View style={styles.title}>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Location History</Text>
            <Text style={{ textAlign: 'right' }}>{formatName(person)}</Text>
          </View>
          <Table
            tdStyle={{ padding: 5 }}
            weightings={[0.8, 0.2]}
          >
            <TH>
              <TD>Location</TD>
              <TD>Time</TD>
            </TH>
            {person.location_history.map(location => (
              <TR>
                <TD>{location.location_name}</TD>
                <TD>{dayjs(location.created_at).format('hh:mm A')}</TD>
              </TR>
            ))}
          </Table>
        </Page>
      ))}
    </Document>
  )
}