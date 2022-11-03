import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { UUID } from 'angular2-uuid';
import { ModalService } from './modal.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookToEdit: Book = {image: '', id: '', title: '', author: '', description: '',price: 0 , isBookCardClicked: false, inCartCount: 0, number: 0};
  bookToAdd: Book = {image: '', id: '', title: '', author: '', description: '',price: 0, isBookCardClicked: false, inCartCount: 0, number: 0};
  searchInput = new BehaviorSubject<string>('');
  bookList: Book[] = this.localStorageService.getBookList();
  user: User = this.localStorageService.getUser();
  isBookEdited = new BehaviorSubject<boolean>(false);
  isBookAddedToList = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private modalService: ModalService, private localStorageService: LocalStorageService) {}

  onOpenBookDetails(book:Book) {
    //this.router.navigate(['/books'], { queryParams: { id: book.id } });
    this.router.navigate(['/books/'+book.number]);
  }

  onEditBook(form: FormGroup) {
    this.bookToEdit.isBookCardClicked=false;
    this.bookToEdit.image = form.get('image')?.value;
    this.bookToEdit.title = form.get('title')?.value;
    this.bookToEdit.description = form.get('description')?.value;
    this.bookToEdit.author = form.get('author')?.value;
    this.bookToEdit.price = form.get('price')?.value;

    for(let book of this.bookList) {
      if(book.id === this.bookToEdit.id) {
        book = this.bookToEdit;
      }
    }
    this.isBookEdited.next(true);
    this.localStorageService.storeBookList(this.bookList);
    this.modalService.exitModal();
  }

  onAddBook(form: FormGroup) {
    this.bookToAdd.id = UUID.UUID();
    this.bookToAdd.isBookCardClicked = false;
    this.bookToAdd.image = form.get('image')?.value;
    this.bookToAdd.title = form.get('title')?.value;
    this.bookToAdd.description = form.get('description')?.value;
    this.bookToAdd.author = form.get('author')?.value;
    this.bookToAdd.price = form.get('price')?.value;
    this.bookToAdd.number = this.bookList.length+1;
    this.bookList.push(this.bookToAdd);
    this.bookToAdd = {image: '', id: '', title: '', author: '', description: '',price: 0, isBookCardClicked: false, inCartCount: 0, number: 0};
    this.isBookAddedToList.next(true);
    this.localStorageService.storeBookList(this.bookList);
    this.modalService.exitModal();
  }

  deleteBook(book: Book) {
    for(let i = 0; i<this.bookList.length; i++) {
      if(this.bookList[i].id == book.id) {
        this.bookList.splice(i,1);
        break;
      }
    }
    this.localStorageService.storeBookList(this.bookList);
  }

  resetBookList(): Book[] {
    this.bookList = [{
      image: 'https://images-na.ssl-images-amazon.com/images/I/71tR2ZEgPYL._AC_UL254_SR254,254_.jpg',
      id: UUID.UUID(),
      title: 'Harry Potter and the Order of the Phoenix: The Illustrated Edition (Harry Potter, Book 5)',
      author: 'J. K. Rowling',
      description: "The fifth book in the beloved, bestselling Harry Potter series, now illustrated in brilliant full color.There is a door at the end of a silent corridor. And its haunting Harry Potters dreams. Why else would he be waking in the middle of the night, screaming in terror? Its not just the upcoming O.W.L. exams; a new teacher with a personality like poisoned honey; a venomous, disgruntled house-elf; or even the growing threat of He-Who-Must-Not-Be-Named. Now Harry Potter is faced with the unreliability of the very government of the magical world and the impotence of the authorities at Hogwarts. Despite this (or perhaps because of it), he finds depth and strength in his friends, beyond what even he knew; boundless loyalty; and unbearable sacrifice. This stunning illustrated edition brings together the talents of award-winning artists Jim Kay and Neil Packer in a visual feast, featuring iconic scenes and much loved characters -- Tonks, Luna Lovegood, and many more -- as the Order of the Phoenix keeps watch over Harry Potter’s fifth year at Hogwarts. With its oversized format, high-quality paper, ribbon bookmark, and color on nearly every page, this edition is the perfect gift for Harry Potter fans and book lovers of all ages.",
      price: 32.99,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 1
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/81PMOtoT7zL._AC_UL127_SR127,127_.jpg',
      id: UUID.UUID(),
      title: 'Fairy Tale',
      author: 'Stephen King',
      description: "Legendary storyteller Stephen King goes into the deepest well of his imagination in this spellbinding novel about a seventeen-year-old boy who inherits the keys to a parallel world where good and evil are at war, and the stakes could not be higher—for that world or ours Charlie Reade looks like a regular high school kid, great at baseball and football, a decent student. But he carries a heavy load. His mom was killed in a hit-and-run accident when he was seven, and grief drove his dad to drink. Charlie learned how to take care of himself—and his dad. When Charlie is seventeen, he meets a dog named Radar and her aging master, Howard Bowditch, a recluse in a big house at the top of a big hill, with a locked shed in the backyard. Sometimes strange sounds emerge from it Charlie starts doing jobs for Mr. Bowditch and loses his heart to Radar. Then, when Bowditch dies, he leaves Charlie a cassette tape telling a story no one would believe. What Bowditch knows, and has kept secret all his long life, is that inside the shed is a portal to another world. King’s storytelling in Fairy Tale soars. This is a magnificent and terrifying tale in which good is pitted against overwhelming evil, and a heroic boy—and his dog—must lead the battle.Early in the Pandemic, King asked himself: “What could you write that would make you happy?” As if my imagination had been waiting for the question to be asked, I saw a vast deserted city—deserted but alive. I saw the empty streets, the haunted buildings, a gargoyle head lying overturned in the street. I saw smashed statues (of what I didn’t know, but I eventually found out). I saw a huge, sprawling palace with glass towers so high their tips pierced the clouds. Those images released the story I wanted to tell.",
      price: 18.49,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 2
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/71PNGYHykrL._AC_UL254_SR254,254_.jpg',
      id: UUID.UUID(),
      title: 'It Starts with Us: A Novel (2) (It Ends with Us)',
      author: 'Colleen Hoover',
      description: "Before It Ends with Us, it started with Atlas. Colleen Hoover tells fan favorite Atlas’s side of the story and shares what comes next in this long-anticipated sequel to the “glorious and touching” (USA TODAY) #1 New York Times bestseller It Ends with Us.",
      price: 5.99,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 3
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/81YlQJgAZSL._AC_UL254_SR254,254_.jpg',
      id: UUID.UUID(),
      title: 'Live Wire: Long-Winded Short Stories',
      author: 'Kelly Ripa',
      description: "A sharp, funny, and honest collection of real-life stories from Kelly Ripa, showing the many dimensions and crackling wit of the beloved daytime talk show host. In Live Wire, her first book, Kelly shows what really makes her tick. As a professional, as a wife, as a daughter and as a mother, she brings a hard-earned wisdom and an eye for the absurdity of life to every minute of every day. It is her relatability in all of these roles that has earned her fans worldwide and millions of followers on social media. Whether recounting how she and Mark really met, the level of chauvinism she experienced on set, how Jersey Pride follows her wherever she goes, and many, many moments of utter mortification (whence she proves that you cannot, in fact, die of embarrassment) Kelly always tells it like it is. Ms. Ripa takes no prisoners. Surprising, at times savage, a little shameless and always with humor… Live Wire shows Kelly as she really is offscreen—a very wise woman who has something to say. ",
      price: 20.29,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 4
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/81O1oy0y9eL._AC_UL127_SR127,127_.jpg',
      id: UUID.UUID(),
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      description: "NOW A MAJOR MOTION PICTURE—The #1 New York Times bestselling worldwide sensation with more than 15 million copies sold, hailed by The New York Times Book Review as “a painfully beautiful first novel that is at once a murder mystery, a coming-of-age narrative and a celebration of nature.” For years, rumors of the “Marsh Girl” have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say. Sensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand. Then the time comes when she yearns to be touched and loved. When two young men from town become intrigued by her wild beauty, Kya opens herself to a new life—until the unthinkable happens.Where the Crawdads Sing is at once an exquisite ode to the natural world, a heartbreaking coming-of-age story, and a surprising tale of possible murder. Owens reminds us that we are forever shaped by the children we once were, and that we are all subject to the beautiful and violent secrets that nature keeps.",
      price: 9.98,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 5
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/81qROMFiwmL._AC_UL127_SR127,127_.jpg',
      id: UUID.UUID(),
      title: "Little Blue Truck's Halloween: A Halloween Book for Kids",
      author: "Jill McElmurry",
      description: "Celebrate Halloween with the #1 New York Times bestselling Little Blue Truck and friends! Beep! Beep! It’s Halloween! Little Blue Truck is picking up his animal friends for a costume party. Lift the flaps in this large, sturdy board book to find out who’s dressed up in each costume! Will Blue wear a costume too? ",
      price: 6.32,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 6
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/81dqJU9AP8L._AC_UL127_SR127,127_.jpg',
      id: UUID.UUID(),
      title: "Come On, Man!: The Truth About Joe Biden's Terrible, Horrible, No-Good, Very Bad Presidency",
      author: "Joe Concha",
      description: "Open borders, record inflation, and skyrocketing crime—Joe Biden’s first term is one of the most craptastic in American history. But on Planet Brandon, it’s all going according to plan ... He received 81 million votes. His party controlled the House and the Senate. He took office with a nearly 60 percent approval rating. His first month saw the economy recovering nicely and the new COVID-19 vaccines being distributed around the country. And, in his words, he had the awesome power to mobilize “truinernashabada pressure.” And yet, with all that and more, Joe Biden’s first term has been a spectacular failure. COVID roared back. The withdrawal from Afghanistan left thirteen U.S. service members dead and hundreds of Americans stranded as Afghans fell from airplanes. Sixteen American cities set homicide records. More than 2.3 million illegal immigrants entered the country. Inflation reached forty-year highs. And Russia invaded Ukraine. Even the Democrats are so embarrassed, they won’t invite Biden to join them on the campaign trail for the midterms. Gah. But is this hot mess, dumpster fire of a record only because Biden lost whatever fastball he had and is perpetually incompetent? In Come On, Man!, Joe Concha reminds us what’s really going on in the White House. Though Biden may seem like a doddering idiot, stumbling from one mistake to the next, his blunders always hew closely to progressive dreams for American policy. Dreams like saving the planet by attacking Elon Musk and strengthening the middle class by making gas prices higher than Hunter Biden in a motel room. Come On, Man! shows the real reason why we’re here—no malarkey, guaranteed!",
      price: 19.25,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 7
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/614Z0u3WipL._AC_SX184_.jpg',
      id: UUID.UUID(),
      title: "The Simply Happy Cookbook: 100-Plus Recipes to Take the Stress Out of Cooking",
      author: "Steve Doocy",
      description: "#1 New York Times bestselling authors Fox & Friends cohost Steve Doocy and his wife, Kathy, share more delightful stories and delicious recipes that are simple and stress-free. What’s better than serving your family food they rave about? Keeping it simple, of course! Sure, there are times when you want to spend all day noodling around in the kitchen, but most days we want more oomph with less effort. In The Simply Happy Cookbook, Steve Doocy and his wife, Kathy, provide more than a hundred recipes for their favorite dishes that are just as comforting to make as they are to eat—using fewer ingredients, simpler preparations, and less time in the kitchen. Just as in their previous two cookbooks, they share family photos and stories along with their recipes, so the time and energy saved in the kitchen can be put toward what’s important—reading charming and funny stories about their family and (sometimes famous) friends. The Doocys offer recipes for every occasion, including appetizers, breakfast, sandwiches, sides, casseroles, slow cooker meals, pasta, pizza, and desserts, so you’re covered no matter what you’re looking to make. Some of their low-effort, all-American comfort dishes include: Maple Bacon Cinnamon Rolls, Lasagna Grilled Cheese Sandwich, Buffalo Chicken Pot Pie, Single Skilled Shrimp and Cheesy Grits, Bacon and Burst Tomato Tortellini, Pretzel Crust Chocolate Peanut Butter Pie. Perfect for low-stress solo dinner prep, or for luring the cooking-averse into the kitchen to create happy memories around more than just the dinner table, The Simply Happy Cookbook is sure to please.",
      price: 19.32,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 8
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/811zJIlF1AL._AC_UL127_SR127,127_.jpg',
      id: UUID.UUID(),
      title: "The Divider: Trump in the White House, 2017-2021",
      author: "Peter Baker",
      description: "NEW YORK TIMES BESTSELLER -mThe most comprehensive and detailed account of the Trump presidency yet published.—The Washington Post. A sumptuous feast of astonishing tales...The more one reads, the more one wishes to read.—NPR.com. The inside story of the four years when Donald Trump went to war with Washington, from the chaotic beginning to the violent finale, told by revered journalists Peter Baker of The New York Times and Susan Glasser of The New Yorker—an ambitious and lasting history of the full Trump presidency that also contains dozens of exclusive scoops and stories from behind the scenes in the White House, from the absurd to the deadly serious. The bestselling authors of The Man Who Ran Washington argue that Trump was not just lurching from one controversy to another; he was learning to be more like the foreign autocrats he admired. The Divider brings us into the Oval Office for countless scenes both tense and comical, revealing how close we got to nuclear war with North Korea, which cabinet members had a resignation pact, whether Trump asked Japan’s prime minister to nominate him for a Nobel Prize and much more. The book also explores the moral choices confronting those around Trump—how they justified working for a man they considered unfit for office, and where they drew their lines. The Divider is based on unprecedented access to key players, from President Trump himself to cabinet officers, military generals, close advisers, Trump family members, congressional leaders, foreign officials and others, some of whom have never told their story until now.",
      price: 14.99,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 9
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/61clZgj1xZL._AC_UL127_SR127,127_.jpg',
      id: UUID.UUID(),
      title: "The Great Reset: And the War for the World",
      author: "Alex Jones",
      description: "In The Great Reset: And the War for the World, the most controversial man on earth Alex Jones gives you a full analysis of The Great Reset, the global elite's international conspiracy to enslave humanity and all life on the planet. If you really want to know what’s happening in the world, this is the one book you must read now. Alex Jones is the most censored man on the planet and you should ask yourself why that is. There is a powerful authoritarian takeover in process that is seeking to capture the entire human system and turn it into an artificial factory farm controlled system. We are in a war for the future of the world. In this book, you will hear from the world’s elites, from their own mouths, what they are planning for you and your families and you will learn what you can do to fight it. From central bankers, corporate billionaires, and corrupted government officials, global elites have been organizing a historic war on humanity under a trans-humanist, scientific dictatorship. Alex Jones was the first major figure to expose the World Economic Forum’s agenda. He has dedicated the last 30 years of his life to studying The Great Reset, conducting tens of thousands of interviews with top-level scientists, politicians, and military officials in order to reverse engineer their secrets and help awaken humanity. The Great Reset: And the War for the World chronicles the history of the global elites rise to power and reveals how they’ve captured the governments of the world and financed The Great Reset to pave the way for The New World Order. Once dubbed a conspiracy theory, but now openly promoted by the most powerful corporations and governments, The Great Reset is a planned attempt to redistribute all the world’s wealth and power into the hands of banks, corporations, billionaires, and The World Economic Forum. If you read one book in a lifetime, this is it. In The Great Reset: And the War for the World, you will discover from the self-appointed controllers of the planet in their own words, their plan for what they call the final revolution, or The Great Reset. The only way this corporate fascist conspiracy can succeed is if the people of the world are not aware of it. And this book lays out their sinister blueprint and how to stop it. While many great books have been written to help awaken people to this sinister agenda, no author has ever spent as much time and research on The Great Reset as Alex Jones. The Great Reset: And the War for the World is the undisputed trailblazer for understanding what’s happening and how to stop it. ",
      price: 20.46,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 10
    },
   ]
    return this.bookList;
  }
}
