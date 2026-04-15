## Deployment

โปรเจกต์นี้เป็นเครื่องมือที่ใช้ AI เพื่อช่วยจับคู่แบรนด์กับ Influencer บน TikTok ที่เหมาะสมในประเทศไทย โดยใช้การวิเคราะห์ข้อมูลและระบบอัตโนมัติผ่าน n8n

ฟีเจอร์หลัก (Features)
1. วิเคราะห์แบรนด์จาก Website หรือ Facebook
2. ใช้ AI (DeepSeek) ในการสกัดคีย์เวิร์ดของแบรนด์
3. ค้นหา TikTok Influencer ผ่าน Apify
4. คำนวณ Engagement Rate ของ Influencer
6. จัดอันดับ Influencer ด้วย AI 

เทคโนโลยีที่ใช้ (Tech Stack)
1. n8n – ระบบ Automation (Backend)
2. DeepSeek API – ใช้สำหรับวิเคราะห์ข้อมูลด้วย AI
3. Apify – ใช้ดึงข้อมูล TikTok Influencer
4. front-end framework react/tyscript

วิธีการใช้งาน
1. เปิด n8n ที่ run บน Docker
2. Import file workflow.json
3. Add API keys (DeepSeek, Apify ,other)
4. run Workflow ใช้งานผ่าน Webhook Endpoint เช่น: http://localhost:5678/webhook/influencer-match
5. run front-end 

Note:
ปัจจุบัน run แบบ Local เพื่อใช้ในการแสดง Demo
หากต้องการใช้งานจริง(Production) สามาารถ Deploy บน n8n Cloud หรือ Docker ได้
