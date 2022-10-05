export function emailHtml(number: string) {
  return `
  <html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div id="readFrame">
    <xmeta charset="UTF-8">
        <xmeta name="viewport" content="width=device-width, initial-scale=1.0">
            <xmeta http-equiv="X-UA-Compatible" content="ie=edge">
                <div style="color:#222;width:100%">
                    <table align="center" style="font-family:Apple SD Gothic Neo, sans-serif;width:100%;max-width:596px; background:#FFF;font-size:16px;line-height:26px;margin:0 auto;table-layout:fixed" cellspacing="0" cellpadding="0">
                        <tbody><tr><td width="20"></td><td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                <tr>
                                    <td height="20"></td>
                                </tr>

                                <tr>
                                    <td height="20"></td>
                                </tr>
                                <tr>
                                    <td height="4" style="background-color:#14adea;background-image: linear-gradient(to left, #14adea, #30f1a5);"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                            <td width="20"></td>
                        </tr>
                        <tr>
                            <td width="20"></td>
                            <td>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tbody><tr><td height="40"></td></tr><tr><td style="text-align: center;">
                                        <img alt="" src="https://ssl.pstatic.net/static/ncp/img/mail/new/m05-top-icon.png" loading="lazy">
                                    </td></tr><tr><td height="25"></td></tr><tr><td style="font-size:30px;line-height:37px;text-align:center;">
                                        <span style="color:#14adea;">가입을 위한 인증번호 </span>입니다.
                                    </td></tr><tr><td height="40"></td></tr><tr><td>
                                        안녕하세요.<br>
                                        <span style="color:#14adea;">Diary Studio</span>를 이용해 주셔서 감사합니다. <br>
                                        아래 <span style="color:#14adea;text-decoration:none;">[이메일 인증번호]</span>를 확인하여 이메일 주소 인증을 완료해 주세요.<br>
                                        감사합니다.
                                    </td>
                                    </tr>
                                    <tr>
                                        <td height="30"></td>
                                    </tr>

                                    <tr>
                                        <td style="text-align:center;">
                                            <div style="font-size: x-large; font-weight: bold;">이메일 인증번호 : ${number} </div>
                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </td><td width="20"></td></tr><tr><td width="100%" height="60" colspan="3"></td></tr><tr><td width="100%" style="border-top:1px solid #eeeeee" colspan="3">
                        </td></tr></tbody>
                    </table>

                    <div style="position: absolute; bottom: 0; width: 100%">
            <ul
              style="
                border-top: 1px solid rgba(gray, 0.7);
                list-style: none;
                padding-inline-start: 0;
                text-align: left;
                padding: 10px 30px;
                font-size: 10px;
                color: rgb(114, 114, 114);
              "
            >
              <li>본 메일은 발신전용입니다.</li>
              <li>Copyright ㈜ Diary Studio. All rights reserved.</li>
            </ul>
          </div>
                </div>
            </xmeta>
        </xmeta>
    </xmeta>
</div>
</body>
</html>`;
}
