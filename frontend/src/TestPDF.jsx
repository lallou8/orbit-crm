import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import FicheInterventionPDF from '../components/FicheInterventionPDF';

function PDFViewer() {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <FicheInterventionPDF />
    </PDFViewer>
  );
}

export default PDFViewer;