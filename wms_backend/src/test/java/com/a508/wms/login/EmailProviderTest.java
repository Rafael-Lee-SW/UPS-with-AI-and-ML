//
// package com.a508.wms.auth.provider;
//
// import com.a508.wms.auth.provider.EmailProvider;
// import jakarta.mail.MessagingException;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
//
// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.mockito.Mockito.*;
//
// import static org.junit.jupiter.api.Assertions.assertTrue;
//
// import jakarta.mail.internet.MimeMessage;
//
// @SpringBootTest
// public class EmailProviderTest {
//
//     @Autowired
//     private EmailProvider emailProvider;
//
//     @MockBean
//     private JavaMailSender javaMailSender;
//
//     @Test
//     public void testSendCertificationMail() throws Exception {
//         // Mock behavior
//         MimeMessage mimeMessage = mock(MimeMessage.class);
//         when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
//         MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
//         when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
//
//         // Call the method to test
//         boolean result = emailProvider.sendCertificationMail("kurladbtjr@gmail.com", "123456");
//
//         // Verify interactions and assert
//         verify(javaMailSender, times(1)).send(mimeMessage);
//         assertTrue(result, "메일 전송이 실패했습니다.");
//     }
//
//     @Test
//     public void testSendCertificationMail_Failure() throws Exception {
//         // Mock behavior to throw an exception
//         MimeMessage mimeMessage = mock(MimeMessage.class);
//         when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
//         doThrow(new MessagingException("SMTP 서버 연결 실패")).when(javaMailSender).send(mimeMessage);
//
//         // Call the method to test
//         boolean result = emailProvider.sendCertificationMail("kurladbtjr@gmail.com", "123456");
//
//         // Verify interactions and assert
//         verify(javaMailSender, times(1)).send(mimeMessage);
//         assertFalse(result, "예외 발생 시 메일 전송이 성공했습니다.");
//     }
// }
//
