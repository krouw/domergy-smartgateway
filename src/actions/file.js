const fs = require('fs')

const deleteFile = ( file ) => {

  fs.unlink( file , (err) => {
    if (err) throw err;
    console.log('successfully deleted', file);
  });

}

const checkFile = ( file, next ) => {
  fs.stat(file, (err, stats) => {
    if (err){
      next(err);
    }
    else {
      next(null, stats)
    }
  });
}


module.exports = {
  deleteFile,
  checkFile
}
