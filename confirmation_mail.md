# Confirmation Email Template for Polytech Portal

Use the following HTML code for your Supabase or custom email service confirmation template.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmez votre compte - Polytech Portal</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #020617;
            margin: 0;
            padding: 0;
            color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #0f172a;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid #1e293b;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .header {
            padding: 40px;
            text-align: center;
            background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        h1 {
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -1px;
            margin-bottom: 10px;
            color: #ffffff;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 18px 36px;
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 14px;
            transition: background-color 0.3s ease;
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
        }
        .footer {
            padding: 30px;
            text-align: center;
            background-color: #020617;
            border-top: 1px solid #1e293b;
        }
        .footer p {
            font-size: 12px;
            margin: 5px 0;
            color: #475569;
            letter-spacing: 1px;
        }
        .link {
            color: #6366f1;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/drvmltyv1/image/upload/v1766702085/thePseudoLineNoBg_a8o42v.png" alt="Polytech Portal Logo" class="logo">
            <h1>Bienvenue sur Polytech Portal</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit sur <strong>Polytech Portal</strong>, votre système d'exploitation académique personnel. Pour finaliser la création de votre compte et accéder à votre dashboard, veuillez confirmer votre adresse email.</p>
            
            <a href="{{ .ConfirmationURL }}" class="button">Confirmer mon compte</a>
            
            <p style="margin-top: 40px; font-size: 14px;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
            <span class="link">{{ .ConfirmationURL }}</span></p>
        </div>
        <div class="footer">
            <p>POLYTECH PORTAL — ESP DGI</p>
            <p><a href="https://pp.bluedish.tech" class="link">pp.bluedish.tech</a></p>
            <p style="font-size: 10px; margin-top: 20px;">Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
```
