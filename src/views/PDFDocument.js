import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import { OrganizationChart } from 'primereact/organizationchart';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import '../views/styleOrganigramme.css'
import logo from '../assets/images/avatar.jpg'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  chartWrapper: {
    // Define your styles for chart-wrapper and chart-container here
    // Example:
    width: '100%',
    height: '100%',
  },
});

const PDFDocument = ({ printed, datta, nodeTemplate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <div style={styles.chartWrapper} className={`${printed ? 'chart-wrapper' : 'chart-wrapperr'}`}>
        {/* Assuming you have imported and set up OrganizationChart */}
        <OrganizationChart value={datta} nodeTemplate={nodeTemplate} className={`${printed ? 'chart-container' : 'chart-containerr'}`} />
      </div>
    </Page>
  </Document>
);

export default PDFDocument;
