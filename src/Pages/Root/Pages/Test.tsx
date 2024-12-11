import React from 'react';
import '@pqina/pintura/pintura.css';
import { getEditorDefaults } from '@pqina/pintura';
import { PinturaEditor } from '@pqina/react-pintura';

const Test = () => {
  // Lisans anahtarınızı buraya ekleyin
  const editorConfig = {
    ...getEditorDefaults(),
    license: 'YOUR_LICENSE_KEY_HERE',  // Lisans anahtarınızı buraya ekleyin
  };

  const handleProcess = (output) => {
    if (output && output.dest) {
      const editedFile = output.dest;

      // İndirilebilir URL oluştur
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(editedFile);
      downloadLink.download = 'edited_image.png'; // İndirilen dosyanın adı
      downloadLink.click();

      // Belleği temizle
      URL.revokeObjectURL(downloadLink.href);
    }
  };

  return (
    <div className="App" style={{ height: '600px' }}>
      <PinturaEditor
        {...editorConfig}
        src="/public/images/logo.png"
        imageCropAspectRatio={1}
        onProcess={handleProcess} // İşlem tamamlandığında çalışacak fonksiyon
      ></PinturaEditor>
    </div>
  );
};

export default Test;
