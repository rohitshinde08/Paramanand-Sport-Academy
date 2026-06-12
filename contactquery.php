<?php
use phpmailer\PHPMailer\PHPMailer;

require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';

$mail=new PHPMailer(true);
$alert='';
if(isset($_POST['submit'])){
  $firstName = $_POST["FirstName"];
    $email = $_POST["Email"];
    $phoneNumber = $_POST["PhoneNumber"];
    $query = $_POST["Query"];
try{
$mail->isSMTP();
$mail->Host='smtp.gmail.com';
$mail->SMTPAuth=true;
$mail->username='prasadsangle008@gmail.com';
$mail->password='uqxigxqgelpynroe';
$mail->SMTPSecure='tls';
$mail->Port='587';
$mail->setForm('prasadsangle008@gmail.com');
$mail->addAddress('prasadsangle008@gmail.com');
$mail->isHTML(true);
$mail->Subject='Message received from contact:".$firstName;
$mail->Body='Name:$firstName <br>Email:$email<br>Phone Number:$phoneNumber<br>
query:$query';
$mail->send();
$alert="<div class='alert-success'><span>Message Sent! Thanks for Contact us</span></div>";
}
catch (Exception $e){
$alert="<div class'alert-error'><span>'.$e->getMessage().'</span></div>";
}
}
?>