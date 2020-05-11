#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri May  8 22:31:39 2020

@author: vishishttiwari
"""


import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from Read_CSV import Read_CSV

senderEmail = 'vishisht@groakapp.com'
sender = 'Groak <' +senderEmail + '>'
replyEmail = 'contact@groakapp.com'
reply = 'Groak <' +replyEmail + '>'
recipients = ['bpunshi22@gmail.com', 'vishishttiwari@gmail.com', 'vmt28@cornell.edu', 'bawikapunshi@icloud.com', 'hartaj96@gmail.com', 'ssabharwal9@hotmail.com', 'padma.vemuri@gmail.com', 'vmt20769@gmail.com', 'vmtiwari@outlook.com']
#recipients = ['vishishttiwari@gmail.com']
#recipients = ['vishishttiwari@gmail.com', 'vmt28@cornell.edu']
#recipients = ['bp153@duke.edu']
#recipients = Read_CSV.findCSV()
subject = "Are you ready to serve your post lockdown customers?"
html = """<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title></title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style type="text/css">
		body {
			margin: 0;
			padding: 0;
		}

		table,
		td,
		tr {
			vertical-align: top;
			border-collapse: collapse;
		}

		* {
			line-height: inherit;
		}

		a[x-apple-data-detectors=true] {
			color: inherit !important;
			text-decoration: none !important;
		}
	</style>
<style id="media-query" type="text/css">
		@media (max-width: 920px) {

			.block-grid,
			.col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}

			.block-grid {
				width: 100% !important;
			}

			.col {
				width: 100% !important;
			}

			.col>div {
				margin: 0 auto;
			}

			img.fullwidth,
			img.fullwidthOnMobile {
				max-width: 100% !important;
			}

			.no-stack .col {
				min-width: 0 !important;
				display: table-cell !important;
			}

			.no-stack.two-up .col {
				width: 50% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num8 {
				width: 66% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num3 {
				width: 25% !important;
			}

			.no-stack .col.num6 {
				width: 50% !important;
			}

			.no-stack .col.num9 {
				width: 75% !important;
			}

			.video-block {
				max-width: none !important;
			}

			.mobile_hide {
				min-height: 0px;
				max-height: 0px;
				max-width: 0px;
				display: none;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide {
				display: block !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #fff;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="#fff" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#fff"><![endif]-->
<div style="background-color:#800000;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 900px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#800000;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="900" style="background-color:transparent;width:900px; border-top: 0px solid #800000; border-left: 0px solid #800000; border-bottom: 0px solid #800000; border-right: 0px solid #800000;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 900px; display: table-cell; vertical-align: top; width: 900px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid #800000; border-left:0px solid #800000; border-bottom:0px solid #800000; border-right:0px solid #800000; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center fixedwidth fullwidthOnMobile" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><a href="https://groakapp.com/" style="outline:none" tabindex="-1" target="_blank"> <img align="center" alt="Groak" border="0" class="center fixedwidth fullwidthOnMobile" src="https://groakapp.com/static/media/white_name_icon.e6fe7259.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; width: 100%; max-width: 450px; display: block;" title="Groak" width="450"/></a>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:transparent;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 900px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="900" style="background-color:transparent;width:900px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 900px; display: table-cell; vertical-align: top; width: 900px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 20px; padding-bottom: 20px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#800000;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;">
<div style="line-height: 1.2; font-size: 12px; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif; color: #800000; mso-line-height-alt: 14px;">
<p style="font-size: 38px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Roboto, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;">ARE YOU READY FOR YOUR POST LOCKDOWN CUSTOMERS?</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 60px; padding-left: 60px; padding-top: 0px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;line-height:1.5;padding-top:0px;padding-right:60px;padding-bottom:0px;padding-left:60px;">
<div style="line-height: 1.5; font-size: 12px; color: #555555; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; mso-line-height-alt: 18px;">
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">With social distancing becoming the new normal of social etiquette in post COVID-19 world, restaurant reservations have fallen by more than <a href="https://www.eater.com/2020/3/24/21184301/restaurant-industry-data-impact-covid-19-coronavirus" rel="noopener" style="text-decoration: underline; color: #0068A5;" target="_blank" title="COVID-19’s Devastating Effect on the Restaurant Industry">40% in the bay area</a>.</span></p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Will the traditional customer-waiter interaction be the same? Probably not! On average, a waiter spends 7 minutes on a table of 4. Your customers will be happier avoiding this exposure.</span></p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Are you ready to serve your extra conscious customers post lockdown?</span></p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Groak is a revolutionary technology which will assure that you’re ready for the new-normal!</span></p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Groak will enable your customers to order food through their phone with an interactive menu. An app that also lets you streamline your day-to-day operations and cut <a href="https://www.restaurantowner.com/public/Restaurant-Rules-of-Thumb-Industry-Averages-Standards.cfm" rel="noopener" style="text-decoration: underline; color: #0068A5;" target="_blank" title="Waiter costs">waiter costs significantly</a>! Through restaurant’s web portal with a table-chat option, Groak will enable you to serve your customer in ‘social distancing’ compliant way by enabling ordering, status update about service timings, and receipt deliveries over mobile phones.</span></p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">If you believe that Groak will support your ambition of a successful restaurant in the new post COVID-19 world, it would be our pleasure to serve you. You can reach out to us on:</span></p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<ul>
<li style="line-height: 1.5; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Email – <a href="mailto:contact@groakapp.com?subject=Contact Groak" style="text-decoration: underline; color: #0068A5;" title="contact@groakapp.com">contact@groakapp.com</a></span></li>
<li style="line-height: 1.5; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Phone number – <a href="tel:6072792474" style="text-decoration: underline; color: #0068A5;" title="tel:6072792474">(607)-279-2474</a></span></li>
<li style="line-height: 1.5; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Visit our website – <a href="https://groakapp.com/" rel="noopener" style="text-decoration: underline; color: #0068A5;" target="_blank" title="Groak">www.groakapp.com</a></span></li>
</ul>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Thank you for your time and consideration. We look forward to hearing from you.</span></p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> </p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Best regards,</span></p>
<p style="line-height: 1.5; word-break: break-word; font-size: 17px; mso-line-height-alt: 26px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;">Team Groak</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#800000;">
<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 900px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#800000;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="450" style="background-color:transparent;width:450px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 450px; display: table-cell; vertical-align: top; width: 450px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div class="mobile_hide">
<div align="left" class="img-container left fixedwidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="left"><![endif]--><a href="https://groakapp.com/" style="outline:none" tabindex="-1" target="_blank"> <img alt="Groak" border="0" class="left fixedwidth" src="https://groakapp.com/static/media/white_name_icon.e6fe7259.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; width: 100%; max-width: 382px; display: block;" title="Groak" width="382"/></a>
<!--[if mso]></td></tr></table><![endif]-->
</div>
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="450" style="background-color:transparent;width:450px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 450px; display: table-cell; vertical-align: top; width: 450px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 20px; padding-bottom: 20px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#fff;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;line-height:1.2;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;">
<div style="line-height: 1.2; font-size: 12px; color: #fff; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: right; mso-line-height-alt: 36px; margin: 0;"><span style="font-size: 30px;">Contact Us</span><br/><span style="font-size: 26px;"><a href="mailto:contact@groakapp.com?subject=Contact Groak" style="text-decoration: none; color: #fff;" title="contact@groakapp.com">contact@groakapp.com</a></span><br/><span style="font-size: 26px;"><a href="tel:6072792474" style="text-decoration: none; color: #fff;" title="tel:6072792474">(607)-279-2474</a></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:transparent;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 900px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="900" style="background-color:transparent;width:900px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 900px; display: table-cell; vertical-align: top; width: 900px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;"><a href="https://groakapp.com" rel="noopener" style="text-decoration: underline; color: #555555;" target="_blank" title="Groak">www.groakapp.com</a> | If you no longer wish to receive these emails, it’s cool — you can <a href="https://groakapp.com" rel="noopener" style="text-decoration: underline; color: #555555;" target="_blank" title="Groak">unsubscribe</a>.</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>"""
text = """Are you ready to serve your post lockdown customers?


With social distancing becoming the new normal of social etiquette in post COVID-19 world, restaurant reservations have fallen by more than 40% in the bay area.

Will the traditional customer-waiter interaction be the same? Probably not! On average, a waiter spends 7 minutes on a table of 4. Your customers will be happier avoiding this exposure.

Are you ready to serve your extra conscious customers post lockdown?

Groak is a revolutionary technology which will assure that you’re ready for the new-normal!
Groak will enable your customers to order food through their phone with an interactive menu. An app that also lets you streamline your day-to-day operations and cut waiter costs significantly! Through restaurant’s web portal with a table-chat option, Groak will enable you to serve your customer in ‘social distancing’ compliant way by enabling ordering, status update about service timings, and receipt deliveries over mobile phones.

If you believe that Groak will support your ambition of a successful restaurant in the new post COVID-19 world, it would be our pleasure to serve you. You can reach out to us on:

•	Email – contact@groakapp.com 
•	Phone number – (607)-279-2474
•	Visit our website – www.groakapp.com

Thank you for your time and consideration. We look forward to hearing from you. 

Best regards, 
Team Groak 
"""

html = html.replace('</span></p>', '</span></p><br>')
html = html.replace('</ul>', '</ul><br>')
html = html.replace('Best regards,</span></p><br>', 'Best regards,</span></p>')
html = html.replace('ARE YOU READY FOR YOUR POST LOCKDOWN CUSTOMERS?</span></p><br>', 'ARE YOU READY FOR YOUR POST LOCKDOWN CUSTOMERS?</span></p>')
html = html.replace('Groak is a revolutionary', '<b>Groak</b> is a revolutionary')

msgHTML = MIMEMultipart('related')
html_message = MIMEText(html, "html")
msgHTML.attach(html_message)


msgAlternative = MIMEMultipart('alternative')
text_message = MIMEText(text, "plain")
msgAlternative.attach(text_message)
msgAlternative.attach(msgHTML)


msgRoot = MIMEMultipart('mixed')
msgRoot['From'] = sender
msgRoot['bcc'] = ', '.join(recipients)
msgRoot['Reply-to'] = reply
msgRoot['Subject'] = subject
msgRoot['List-Unsubscribe'] = "<mailto: unsubscribe@groakapp.com?subject=unsubscribe>"
msgRoot.attach(msgAlternative)


server = smtplib.SMTP('smtp.gmail.com', 587)
#server.set_debuglevel(1)
server.ehlo()
server.starttls()
server.ehlo()
server.login(senderEmail, "Put Your Password")
server.send_message(msgRoot)
server.quit()