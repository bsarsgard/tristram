function Markov(titles) {
  this.terminals = {};
  this.startwords = [];
  this.wordstats = {};

  for (var i = 0; i < titles.length; i++) {
    var words = titles[i].split(' ');
    this.terminals[words[words.length-1]] = true;
    this.startwords.push(words[0]);
    for (var j = 0; j < words.length - 1; j++) {
      if (this.wordstats.hasOwnProperty(words[j])) {
        this.wordstats[words[j]].push(words[j+1]);
      } else {
        this.wordstats[words[j]] = [words[j+1]];
      }
    }
  }

  this.choice = function (a) {
      var i = Math.floor(a.length * Math.random());
      return a[i];
  };

  this.make_title = function (min_length, max_length) {
      word = this.choice(this.startwords);
      var title = [word];
      while (this.wordstats.hasOwnProperty(word)) {
        var next_words = this.wordstats[word];
        word = this.choice(next_words);
        title.push(word);
        if (title.length > min_length && this.terminals.hasOwnProperty(word)) break;
      }
      if (title.length < min_length) {
        return this.make_title(min_length, max_length);
      };
      // capitalize words > 2 characters, and first word
      var iTitle = title.length, word;
      while (iTitle--) {
        word = title[iTitle];
        if (word.length > 2 || iTitle == 0) {
          title[iTitle] = word.charAt(0).toUpperCase() + word.slice(1);
        }
      }
      title = title.join(' ');
      if (max_length !== undefined && max_length.length > max_length) {
        return this.make_title(min_length, max_length);
      }
      return title;
  };
};

function Randomizer(titles) {
  this.words = [[]];

  for (var i = 0; i < titles.length; i++) {
    var ws = titles[i].split(' ');
    for (var j = 0; j < ws.length; j++) {
      if (this.words[j] === undefined) {
        this.words[j] = [];
      }
      this.words[j].push(ws[j]);
    }
  }

  this.choice = function (a) {
      var i = Math.floor(a.length * Math.random());
      return a[i];
  };

  this.make_title = function(min_length) {
    title = [];
    for (var i = 0; i < min_length; i++) {
      title.push(this.choice(this.words[i]));
    }
    return title.join(' ');
  };
};

