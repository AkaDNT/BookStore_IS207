<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement("
        INSERT INTO books (
    title, author, description, category, price, publisher,
    publication_date, language, reading_age, pages, dimension, quantity, discount
)
VALUES
('Financial Feminist', 'Brianna Miller', 'A groundbreaking exploration of feminist economics in modern finance', 'Finance', 35.00, 'EmpowerPress', '2019-06-15', 'English', 18, 320, '6x9', 5, 0),
('No More Police', 'James Carter', 'A provocative critique of law enforcement practices in contemporary society', 'Sociology', 28.50, 'JusticeHouse', '2018-11-10', 'English', 16, 280, '6x9', 5, 0),
('I''m Glad My Mom Died', 'Lisa Andrews', 'A memoir about loss, love, and the complicated legacy of a mother', 'Memoir', 22.99, 'Heartfelt Publishing', '2020-03-05', 'English', 17, 250, '6x9', 5, 0),
('Nona the Ninth', 'Rachel Summers', 'An epic fantasy tale of magic, mystery, and ancient legacies', 'Fantasy', 30.00, 'MythicBooks', '2021-09-21', 'English', 14, 410, '6x9', 5, 0),
('1984', 'George Orwell', 'A dystopian novel about totalitarian regimes and surveillance', 'Fiction', 15.99, 'Secker and Warburg', '1949-06-08', 'English', 16, 328, '5x8', 5, 0),
('Animal Farm', 'George Orwell', 'An allegorical novella reflecting events leading up to the Russian Revolution', 'Political Satire', 12.99, 'Secker and Warburg', '1945-08-17', 'English', 16, 112, '5x8', 5, 0),
('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic novel depicting the American society during the Roaring Twenties', 'Fiction', 10.99, 'Charles Scribner''s Sons', '1925-04-10', 'English', 15, 180, '5x8', 5, 0),
('To Kill a Mockingbird', 'Harper Lee', 'A novel about racial injustice and the destruction of innocence', 'Fiction', 14.99, 'J.B. Lippincott and Co.', '1960-07-11', 'English', 12, 281, '5x8', 5, 0),
('Pride and Prejudice', 'Jane Austen', 'A classic romance novel that also critiques the British landed gentry', 'Romance', 9.99, 'T. Egerton', '1813-01-28', 'English', 14, 432, '5x8', 5, 0),
('The Catcher in the Rye', 'J.D. Salinger', 'A novel about teenage rebellion and alienation', 'Fiction', 13.99, 'Little, Brown and Company', '1951-07-16', 'English', 13, 214, '5x8', 5, 0),
('Moby Dick', 'Herman Melville', 'An epic tale of the voyage of the whaling ship Pequod', 'Adventure', 11.99, 'Harper and Brothers', '1851-11-14', 'English', 18, 635, '5x8', 5, 0),
('War and Peace', 'Leo Tolstoy', 'A historical epic that intertwines the lives of families during the Napoleonic Wars', 'Historical', 20.99, 'The Russian Messenger', '1869-01-01', 'Russian', 18, 1225, '5x8', 5, 0),
('The Lord of the Rings', 'J.R.R. Tolkien', 'An epic high-fantasy novel set in Middle-earth', 'Fantasy', 29.99, 'Allen and Unwin', '1954-07-29', 'English', 12, 1216, '5x8', 5, 0),
('The Hobbit', 'J.R.R. Tolkien', 'A prelude to The Lord of the Rings, detailing Bilbo Baggins'' adventure', 'Fantasy', 14.99, 'Allen and Unwin', '1937-09-21', 'English', 10, 310, '5x8', 5, 0),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'The first installment of the Harry Potter series, introducing the magical world', 'Fantasy', 19.99, 'Bloomsbury', '1997-06-26', 'English', 8, 223, '5x8', 5, 0),
('The Da Vinci Code', 'Dan Brown', 'A mystery thriller that follows symbologist Robert Langdon', 'Thriller', 16.99, 'Doubleday', '2003-04-03', 'English', 14, 689, '5x8', 5, 0),
('The Alchemist', 'Paulo Coelho', 'A philosophical novel about following your dreams and listening to your heart', 'Fiction', 12.99, 'HarperTorch', '1988-04-01', 'Portuguese', 12, 197, '5x8', 5, 0),
('The Kite Runner', 'Khaled Hosseini', 'A story of friendship and redemption set against the backdrop of Afghanistan', 'Fiction', 14.99, 'Riverhead Books', '2003-05-29', 'English', 14, 371, '5x8', 5, 0),
('The Girl on the Train', 'Paula Hawkins', 'A psychological thriller about the secrets observed during a daily commute', 'Thriller', 13.99, 'Riverhead Books', '2015-01-13', 'English', 15, 395, '5x8', 5, 0),
('Gone Girl', 'Gillian Flynn', 'A suspenseful thriller that explores the complexities of marriage', 'Thriller', 15.99, 'Crown', '2012-06-05', 'English', 16, 422, '5x8', 5, 0),
('The Fault in Our Stars', 'John Green', 'A touching story about young love and the challenges of illness', 'Fiction', 12.99, 'Dutton Books', '2012-01-10', 'English', 12, 313, '5x8', 5, 0),
('The Chronicles of Narnia', 'C.S. Lewis', 'A classic fantasy series that transports readers to the magical world of Narnia', 'Fantasy', 25.99, 'Geoffrey Bles', '1950-10-16', 'English', 10, 768, '5x8', 5, 0);
    ");
    }
}
