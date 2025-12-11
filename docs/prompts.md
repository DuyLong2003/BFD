# AI Prompts Log

## Feature: Articles Module
**Tool:** ChatGPT/Gemini

### Prompt 1: Generate Service Logic
**Role:** Backend Developer
**Task:** Viết NestJS Service cho Article với yêu cầu: Auto-generate slug từ title dùng thư viện slugify, projection loại bỏ content khi get list.
**Output Evaluation:** Code chạy tốt, nhưng cần sửa lại phần xử lý trùng lặp slug thủ công.

### Prompt 2: Unit Test
**Task:** Viết Unit Test Jest cho hàm create() của ArticlesService, mock Mongoose Model.
**Constraints:** Coverage phải trên 60%.