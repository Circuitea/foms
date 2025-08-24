import { StyleSheet, Text } from "@react-pdf/renderer";
import { PropsWithChildren } from "react";

const styles = StyleSheet.create({
  base: {
    width: '6.5in',
    paddingBottom: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  heading_one: {
    fontWeight: 'bold',
    fontSize: 14,
    borderBottom: 1,
    borderBottomColor: 'black',
  },
  heading_two: {
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export function HeadingOne({ children }: PropsWithChildren) {
  return <Text style={[styles.base, styles.heading_one]}>{children}</Text>
}

export function HeadingTwo({ children }: PropsWithChildren) {
  return <Text style={[styles.base, styles.heading_two]}>{children}</Text>
}