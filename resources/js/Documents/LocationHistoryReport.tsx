import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { HeadingOne } from "./components/Heading";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";

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

export function LocationHistoryReport() {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ textAlign: 'center', color: '#6b7280' }}>{"{HEADER PLACEHOLDER}"}</Text>
        </View>
        <View style={styles.title}>
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Location History</Text>
          <Text style={{ textAlign: 'right' }}>July 30, 2002</Text>
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
          <TR>
            <TD>Sarmiento, Charles Aaron Y.</TD>
            <TD>09:00AM</TD>
            <TD>04:30PM</TD>
          </TR>
        </Table>
      </Page>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.title}>
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Location History</Text>
          <Text style={{ textAlign: 'right' }}>Sarmiento, Charles Aaron Y.</Text>
        </View>
        <Table
          tdStyle={{ padding: 5 }}
          weightings={[0.8, 0.2]}
        >
          <TH>
            <TD>Location</TD>
            <TD>Time</TD>
          </TH>
          <TR>
            <TD>F. Manalo Street, Brgy. Kabayanan</TD>
            <TD>09:00AM</TD>
          </TR>
          <TR>
            <TD>F. Manalo Street, Brgy. Kabayanan</TD>
            <TD>09:15AM</TD>
          </TR>
          <TR>
            <TD>F. Manalo Street, Brgy. Kabayanan</TD>
            <TD>09:30AM</TD>
          </TR>
          <TR>
            <TD>F. Manalo Street, Brgy. Kabayanan</TD>
            <TD>09:45AM</TD>
          </TR>
          <TR>
            <TD>F. Manalo Street, Brgy. Kabayanan</TD>
            <TD>10:00AM</TD>
          </TR>
        </Table>
      </Page>
    </Document>
  )
}