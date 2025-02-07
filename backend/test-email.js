const sendEmail = require('./utils/sendEmail');
require('dotenv').config();

const testEmail = async () => {
  try {
    await sendEmail({
      email: '<テスト用の受信メールアドレス>',
      subject: 'テストメール',
      html: '<h1>テストメール</h1><p>メール送信のテストです。</p>'
    });
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
  process.exit(0);
};

testEmail(); 