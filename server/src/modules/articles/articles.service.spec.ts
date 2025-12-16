// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { ArticlesService } from './articles.service';
// import { Article } from './schemas/article.schema';
// import { BadRequestException, NotFoundException } from '@nestjs/common';

// // 1. Mocking Mongoose Query Chain (Để xử lý .select().populate().exec())
// const mockQuery = {
//     select: jest.fn().mockReturnThis(),
//     populate: jest.fn().mockReturnThis(),
//     sort: jest.fn().mockReturnThis(),
//     skip: jest.fn().mockReturnThis(),
//     limit: jest.fn().mockReturnThis(),
//     exec: jest.fn(),
// };

// // 2. Mocking Mongoose Model (Class based)
// // Dùng class để giả lập việc gọi 'new this.articleModel()'
// class MockArticleModel {
//     private data: any;
//     save: Function; // Khai báo kiểu dữ liệu cho save

//     constructor(data: any) {
//         this.data = data;
//         // Fix lỗi 2729: Khởi tạo save bên trong constructor
//         this.save = jest.fn().mockResolvedValue({ ...this.data, _id: 'mockId', slug: 'da-tao-slug-tu-dong' });
//     }

//     // Static methods (Giả lập các hàm gọi trực tiếp từ Model như Model.find)
//     static find = jest.fn().mockReturnValue(mockQuery);
//     static findOne = jest.fn().mockReturnValue(mockQuery); // Đã thêm findOne
//     static findById = jest.fn().mockReturnValue(mockQuery);
//     static findByIdAndUpdate = jest.fn().mockReturnValue(mockQuery);
//     static findByIdAndDelete = jest.fn().mockReturnValue(mockQuery);
// }

// describe('ArticlesService', () => {
//     let service: ArticlesService;
//     let model: typeof MockArticleModel;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 ArticlesService,
//                 {
//                     provide: getModelToken(Article.name),
//                     useValue: MockArticleModel, // Inject Class Mock thay vì Object
//                 },
//             ],
//         }).compile();

//         service = module.get<ArticlesService>(ArticlesService);
//         model = module.get(getModelToken(Article.name));

//         // Reset lại các mock function trước mỗi test case để tránh dữ liệu rác
//         jest.clearAllMocks();
//         MockArticleModel.find.mockReturnValue(mockQuery);
//         MockArticleModel.findOne.mockReturnValue(mockQuery);
//         mockQuery.exec.mockReset();
//     });

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     // --- TEST CASE 1: CREATE ---
//     describe('create', () => {
//         it('should create a new article', async () => {
//             const dto = { title: 'NestJS Test', content: 'Content', category: 'catId' };

//             // Mock findOne trả về null (nghĩa là slug chưa tồn tại -> OK tạo mới)
//             (MockArticleModel.findOne as jest.Mock).mockResolvedValue(null);

//             const result = await service.create(dto as any);

//             expect(MockArticleModel.findOne).toHaveBeenCalled(); // Kiểm tra xem có check trùng slug không
//             expect(result).toHaveProperty('_id', 'mockId');
//         });
//     });

//     // --- TEST CASE 2: FIND ALL ---
//     describe('findAll', () => {
//         it('should return array of articles with projection', async () => {
//             const mockArticles = [{ title: 'A1' }, { title: 'A2' }];
//             mockQuery.exec.mockResolvedValue(mockArticles); // Mock kết quả trả về

//             const result = await service.findAll({ page: 1, limit: 10 });

//             expect(MockArticleModel.find).toHaveBeenCalled();
//             expect(mockQuery.select).toHaveBeenCalledWith('-content'); // Quan trọng: Check logic bỏ content
//             expect(mockQuery.populate).toHaveBeenCalled();
//             expect(result).toEqual(mockArticles);
//         });
//     });

//     // --- TEST CASE 3: FIND ONE (Validation) ---
//     describe('findOne', () => {
//         it('should throw BadRequest if ID is invalid', async () => {
//             // Test case này yêu cầu service phải có check isValidObjectId
//             await expect(service.findOne('invalid-id'))
//                 .rejects
//                 .toThrow(BadRequestException);
//         });

//         it('should return article if found', async () => {
//             const validId = '6573c5d69733475960411111'; // ID mongo chuẩn 24 ký tự
//             const mockArticle = { _id: validId, title: 'Test Detail' };
//             mockQuery.exec.mockResolvedValue(mockArticle);

//             const result = await service.findOne(validId);
//             expect(MockArticleModel.findById).toHaveBeenCalledWith(validId);
//             expect(result).toEqual(mockArticle);
//         });
//     });
// });