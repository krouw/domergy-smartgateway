const fs = require('fs')

const deleteFile = ( file ) => {

  fs.unlink( file , (err) => {
    if (err) throw err;
    console.log('successfully deleted', file);
  });

}

module.exports = {
  deleteFile,
}
