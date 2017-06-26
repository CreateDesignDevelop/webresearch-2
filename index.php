<?php
  session_start();

  $uploadpath = 'audio/';           // directory to store the uploaded files
  $max_size = 30000;                // maximum file size, in KiloBytes
  $alwidth = 900;                   // maximum allowed width, in pixels
  $alheight = 800;                  // maximum allowed height, in pixels
  $allowtype = array('wav', 'mp3'); // allowed extensions

  if(isset($_FILES['fileup']) && strlen($_FILES['fileup']['name']) > 1) {
    $uploadpath = $uploadpath . basename( $_FILES['fileup']['name']);        // gets the file name
    $sepext = explode('.', strtolower($_FILES['fileup']['name']));
    $type = end($sepext);                                                    // gets extension
    list($width, $height) = getimagesize($_FILES['fileup']['tmp_name']);     // gets image width and height
    $err = '';                                                               // to store the errors

    if(!in_array($type, $allowtype)) $err .= 'The file: <b>'. $_FILES['fileup']['name']. '</b> not has the allowed extension type.';
    if($_FILES['fileup']['size'] > $max_size*1000) $err .= '<br/>Maximum file size must be: '. $max_size. ' KB.';
    if(isset($width) && isset($height) && ($width >= $alwidth || $height >= $alheight)) $err .= '<br/>The maximum Width x Height must be: '. $alwidth. ' x '. $alheight;

    if($err == '') {
      if(move_uploaded_file($_FILES['fileup']['tmp_name'], $uploadpath)) {
        // echo 'File: '. basename( $_FILES['fileup']['name']). '</br> successfully uploaded:';
        // echo '<br/>File type: <b>'. $_FILES['fileup']['type'] .'</b>';
        // echo '<br />Size: <b>'. number_format($_FILES['fileup']['size']/1024, 3, '.', '') .'</b> KB';
        // if(isset($width) && isset($height)) echo '<br/>Image Width x Height: '. $width. ' x '. $height;
        // echo '<br/><br/>Image address: <b>http://'.$_SERVER['HTTP_HOST'].rtrim(dirname($_SERVER['REQUEST_URI']), '\\\\/').'/'.$uploadpath.'</b>';
        // echo '<br>session: ' . $_SESSION['songUploaded'];

        $_SESSION['songUploaded']  = $_FILES['fileup']['name'];
      }
      else echo '<b>Unable to upload the file.</b>';
    }
    else echo $err;
  }

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="styles/css/app.css">
  </head>
  <body>
    <?php if ( $_SESSION['songUploaded'] ): ?>
      <?php
        echo "Song Uploaded: " . $_SESSION['songUploaded'];
        echo "<audio id='audio' src='audio/". $_SESSION['songUploaded']."'></audio>";
      ?>
      <p id="frequencyData"></p>
    <?php endif ?>

    <div id="canvasdiv">
        <canvas id="canvas" width="10000" height="500"></canvas>
    </div>

    <div id="controls">
      Upload New Song
      <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST" enctype="multipart/form-data">
        <input type="file" name="fileup"/><br>
        <input id="fileUpload" type="submit" name='submit' value="Upload"/>
      </form>
      <br>
      <?php if ( $_SESSION['songUploaded'] ): ?>
        <input id="vol-control" type="range" min="0" max="100" value="100" step="1"/>
        <button id="play">play</button>
        <button id="pause">pause</button>
        <button id="capture">capture</button>
      <?php endif ?>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="http://code.jquery.com/ui/1.11.1/jquery-ui.min.js"></script>

    <script src="js/html2canvas.js"></script>
    <script src="js/script.js"></script>
  </body>
</html>
