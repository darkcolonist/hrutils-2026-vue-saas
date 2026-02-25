<?php

namespace Database\Seeders;

use App\Models\Books as ModelsBooks;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Books extends Seeder
{
  private $books = [
    ['title' => 'Clean Code: A Handbook of Agile Software Craftsmanship', 'author' => 'Robert C. Martin'],
    ['title' => 'The Pragmatic Programmer: Your Journey to Mastery', 'author' => 'Andrew Hunt and David Thomas'],
    ['title' => 'Design Patterns: Elements of Reusable Object-Oriented Software', 'author' => 'Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides'],
    ['title' => 'Introduction to the Theory of Computation', 'author' => 'Michael Sipser'],
    ['title' => 'Refactoring: Improving the Design of Existing Code', 'author' => 'Martin Fowler'],
    ['title' => 'Code Complete: A Practical Handbook of Software Construction', 'author' => 'Steve McConnell'],
    ['title' => 'JavaScript: The Good Parts', 'author' => 'Douglas Crockford'],
    ['title' => 'Effective Java', 'author' => 'Joshua Bloch'],
    ['title' => 'Programming Pearls', 'author' => 'Jon Bentley'],
    ['title' => 'The C Programming Language', 'author' => 'Brian W. Kernighan and Dennis M. Ritchie'],
    ['title' => 'Python Crash Course', 'author' => 'Eric Matthes'],
    ['title' => 'The Art of Computer Programming', 'author' => 'Donald E. Knuth'],
    ['title' => 'Eloquent JavaScript', 'author' => 'Marijn Haverbeke'],
    ['title' => 'Algorithms', 'author' => 'Robert Sedgewick and Kevin Wayne'],
    ['title' => 'Artificial Intelligence: A Modern Approach', 'author' => 'Stuart Russell and Peter Norvig'],
    ['title' => 'Structure and Interpretation of Computer Programs', 'author' => 'Harold Abelson and Gerald Jay Sussman'],
    ['title' => 'Introduction to Algorithms', 'author' => 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein'],
    ['title' => 'Head First Design Patterns', 'author' => 'Eric Freeman, Elisabeth Robson, Bert Bates, and Kathy Sierra'],
    ['title' => 'The Mythical Man-Month', 'author' => 'Frederick P. Brooks Jr.'],
    ['title' => 'The Phoenix Project', 'author' => 'Gene Kim, Kevin Behr, and George Spafford'],
    ['title' => 'Practical Object-Oriented Design in Ruby', 'author' => 'Sandi Metz'],
    ['title' => 'Cracking the Coding Interview', 'author' => 'Gayle Laakmann McDowell'],
    ['title' => 'Test-Driven Development: By Example', 'author' => 'Kent Beck'],
    ['title' => 'Structure and Interpretation of Computer Programs', 'author' => 'Harold Abelson and Gerald Jay Sussman'],
    ['title' => 'Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation', 'author' => 'Jez Humble and David Farley'],
    ['title' => 'The Docker Book: Containerization is the new virtualization', 'author' => 'James Turnbull'],
    ['title' => 'Effective C++: 55 Specific Ways to Improve Your Programs and Designs', 'author' => 'Scott Meyers'],
    ['title' => 'The Linux Programming Interface', 'author' => 'Michael Kerrisk'],
    ['title' => 'Computer Systems: A Programmer\'s Perspective', 'author' => 'Randal E. Bryant and David R. O\'Hallaron'],
    ['title' => 'Refactoring to Patterns', 'author' => 'Joshua Kerievsky'],
    ['title' => 'The Art of Agile Development', 'author' => 'James Shore and Shane Warden'],
    ['title' => 'Metaprogramming Ruby', 'author' => 'Paolo Perrotta'],
    ['title' => 'The Rust Programming Language', 'author' => 'Steve Klabnik and Carol Nichols'],
    ['title' => 'You Don\'t Know JS (book series)', 'author' => 'Kyle Simpson'],
    ['title' => 'Real-Time Rendering', 'author' => 'Tomas Akenine-Möller, Eric Haines, Naty Hoffman'],
    ['title' => 'Node.js Design Patterns', 'author' => 'Mario Casciaro'],
    ['title' => 'Automate the Boring Stuff with Python', 'author' => 'Al Sweigart'],
    ['title' => 'The Go Programming Language', 'author' => 'Alan A. A. Donovan and Brian W. Kernighan'],
    ['title' => 'Kotlin in Action', 'author' => 'Dmitry Jemerov and Svetlana Isakova'],
    ['title' => 'Reactive Programming with RxJava', 'author' => 'Tomasz Nurkiewicz and Ben Christensen'],
    ['title' => 'Database Systems: The Complete Book', 'author' => 'Hector Garcia-Molina, Jennifer Widom, and Jeffrey Ullman'],
    ['title' => 'Agile Estimating and Planning', 'author' => 'Mike Cohn'],
    ['title' => 'Deep Learning', 'author' => 'Ian Goodfellow, Yoshua Bengio, and Aaron Courville'],
    ['title' => 'Head First Java', 'author' => 'Kathy Sierra and Bert Bates'],
    ['title' => 'Advanced Programming in the UNIX Environment', 'author' => 'W. Richard Stevens and Stephen A. Rago'],
    ['title' => 'Pro Git', 'author' => 'Scott Chacon and Ben Straub'],
    ['title' => 'Mastering Regular Expressions', 'author' => 'Jeffrey E. F. Friedl'],
    ['title' => 'The Elements of Computing Systems', 'author' => 'Noam Nisan and Shimon Schocken'],
    ['title' => 'Learning Perl', 'author' => 'Randal L. Schwartz, brian d foy, Tom Phoenix'],
    ['title' => 'The Ruby Programming Language', 'author' => 'David Flanagan and Yukihiro Matsumoto'],
    ['title' => 'Designing Data-Intensive Applications', 'author' => 'Martin Kleppmann']
  ];

  /**
  * Run the database seeds.
  */
  public function run(): void
  {
    foreach ($this->books as $bookItem) {
      ModelsBooks::create($bookItem);
    }
  }
}
