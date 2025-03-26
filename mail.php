<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Correct autoload file


function responseHandler($status,$msg)
{
    if($status){
        http_response_code(200);
        $response = [
            "code" => 200,
            "message" => $msg
        ];
        echo json_encode($response);
    }else{
        http_response_code(500);
        $response = [
            "code" => 500,
            "message" => $msg
        ];
        echo json_encode($response);
    }
    exit;
}


list($name, $email, $subject, $message) = array_values($_POST);

// Create HTML content
$html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inquiry</title>
</head>
<body>
    <div class="template-container">
        <h2>Inquiry from ' . htmlspecialchars($name) . '</h2>
    </div>
    <table id="users" border="1" cellpadding="10">
        <tr>
            <th>Name</th>
            <td>' . htmlspecialchars($name) . '</td>
        </tr>
        <tr>
            <th>Email</th>
            <td>' . htmlspecialchars($email) . '</td>
        </tr>
        <tr>
            <th>Subject</th>
            <td>' . htmlspecialchars($subject) . '</td>
        </tr>
        <tr>
            <th>Message</th>
            <td>' . nl2br(htmlspecialchars($message)) . '</td>
        </tr>
    </table>
</body>
</html>';

$mail = new PHPMailer(true);
try {
    // Server settings
/*     $mail->SMTPDebug = 2;  */
    $mail->isSMTP();
    $mail->Host       = 'ledikdent.si'; // SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'formtest@ledikdent.si'; // Your SMTP username
    $mail->Password   = '&TPhP+Y^Z%ak';         // Your SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encryption type
    $mail->Port       = 587; // Use 587 for STARTTLS (change to 465 for SSL)

    // SMTP options
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ],
    ];

    // Recipients
    $mail->setFrom('formtest@ledikdent.si', 'Website Inquiry'); // Sender email and name
    $mail->addAddress('lalasac1@gmail.com', 'Administrator');   // Add recipient
    $mail->addReplyTo($email, $name);                           // Reply-To header

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $html;
    $mail->AltBody = strip_tags($html); // For non-HTML email clients

    $mail->send();
   responseHandler(true, "mail sent successfully");
} catch (Exception $e) {
    responseHandler(false, 'Mail not sent. Mailer error: ' . $mail->ErrorInfo);
}