function User(name) {
  this.name  = name;
}

User.prototype.hello = function (who) {
  console.log('Hello ' + who.name);
};

let vasy = new User('Vasy');
let pety = new User('Pety');

vasy.hello(pety);