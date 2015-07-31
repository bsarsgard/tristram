var Level = function(level) {
  this.level = level;
  this.monsters = [];
  this.dragon = null;

  /* Constructor */
  if (level == 10) {
    this.dragon = new Monster(level + 1).get_instance();
    this.dragon.name = "Diabolique";
    this.dragon.dexterity = this.dragon.level * 3 + 4;
    this.dragon.intelligence = this.dragon.level * 3 + 4;
    this.dragon.strength = this.dragon.level * 3 + 4;
    this.dragon.ac = Math.ceil(this.dragon.level / 2);
    this.dragon.hp = (this.dragon.dexterity + this.dragon.strength) * 10;
    Game.addLog("A hero has challenged The Diabolique!!");
  } else if (level > 1) {
    var name = [];
    while (name.length < 2) {
      this.dragon = new Monster(level + 1).get_instance();
      name = this.dragon.name.split(' ');
    }
    this.dragon.hp = this.dragon.hp * 10;
    this.dragon.name = name[name.length - 1] = "Dragon";
    this.dragon.name = name.join(' ');
    Game.addLog("The " + this.dragon.name + " has awoken!");
  }

  // pull in a few monsters from the previous level
  var iLevel = Game.levels.length, monster;
  while (iLevel--) {
    monster = choice(Game.levels[iLevel].monsters);
    // level it up
    monster = new Monster(monster.level + 1, monster.name);
    this.monsters.push(monster);
  }
  // create monsters for each level, starting with 0
  for (var i = 0; i <= level; i++) {
    for (var j = 0; j < ((i + 1) * 2); j++) {
      // create [(level + 1) * 2] of each (adds variety at deep levels, and makes
      // the levels top-heavy so not too easy)
      this.monsters.push(new Monster(i));
    }
  }
};
var Monster = function(level, name) {
  this.level = level;
  // stats are (3 + level) - (2 * level)
  // so level 1 is 4-6, 5 is 8-18, 10 is 13-33, 15 is 18-48
  this.dexterity = Math.floor(Math.random() * (level * 3 + 1)) + 3;
  this.intelligence = Math.floor(Math.random() * (level * 3 + 1)) + 3;
  this.strength = Math.floor(Math.random() * (level * 3 + 1)) + 3;
  this.hp = this.dexterity + this.strength;
  // ac is 0 - (level / 2)
  this.ac = Math.floor(Math.random() * level / 2);
  if (name === undefined) {
    this.name = Game.monsterMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' ');
  } else {
    this.name = name;
  }

  this.get_name = function() {
    if (this.level == 0) {
      return "Baby " + this.name;
    } else if (this.level == 1) {
      return "Lesser " + this.name;
    } else if (this.level == 8) {
      return "Greater " + this.name;
    } else if (this.level > 8) {
      return "Ancient " + this.name;
    } else {
      return this.name;
    }
  };

  this.get_instance = function() {
    return {
      level: this.level,
      name: this.get_name(),
      dexterity: this.dexterity,
      intelligence: this.intelligence,
      strength: this.strength,
      ac: this.ac,
      hp: this.hp,
      cast_delay: Game.cast_delay
    }
  };
};
var Item = function(level, type) {
  this.level = level;
  this.suffix = "";
  this.type = type;
  this.subtype = "";
  this.material = "";
  this.strength = 0;
  this.dexterity = 0;
  this.intelligence = 0;
  this.ac = 0;
  this.durability = 0;
  this.materials = {
    "armor": ['leather', 'studded', 'chainmail', 'scale', 'plate'],
    "heavy_weapon": ['crude', 'good', 'iron', 'steel', 'mithril'],
    "light_weapon": ['wooden', 'bronze', 'iron', 'steel', 'mithril'],
    "wand": ['garnet', 'sapphire', 'ruby', 'emerald'],
    "jewelry": ['amethyst', 'sapphire', 'ruby', 'diamond']
  };

  this.age = function() {
    if (this.durability > 0 && Math.floor(Math.random() * Game.degrade_chance) == 0) {
      this.durability--;
      if (this.durability == 0) {
        this.strength = 0;
        this.dexterity = 0;
        this.intelligence = 0;
        this.ac = 0;
      }
    }
  };
  this.buy_price = function() {
    return this.level * Game.buy_price[this.type];
  };
  this.sell_price = function() {
    if (this.durability > 0) {
      return this.level * Game.itemsPrice;
    } else {
      return 0;
    }
  };
  this.get_name = function() {
    var name = this.material + " " + this.subtype + this.suffix;
    var bonus = this.level - this.materials[this.type].indexOf(this.material) - 1;
    if (bonus > 0) {
      name += " +" + bonus;
    }
    if (this.durability == 0) {
      name = "Broken " + name;
    } else if (this.durability <= 2) {
      name = "Worn " + name;
    }
    return name;
  };
  this.getTextureRect = function() {
    var x;
    var y;
    switch (this.type) {
      case 'armor':
        var shirt = null;
        var pants = null;
        var hat = null;
        var shield = null;
        x = 12 * 17;
        y = 4 * 17;
        switch (this.material) {
          case 'leather':
            shirt = new cc.Rect(8 * 17, 4 * 17, 16, 16);
            pants = new cc.Rect(3 * 17, 1 * 17, 16, 16);
            hat = new cc.Rect(0, 68, 16, 16);
            shield = new cc.Rect(33 * 17 + (Math.floor(Math.random() * 4) * 17), 0 + (Math.floor(Math.random() * 3) * 17), 16, 16);
            break;
          case 'studded':
            shirt = new cc.Rect(6 * 17, 4 * 17, 16, 16);
            pants = new cc.Rect(3 * 17, 1 * 17, 16, 16);
            hat = new cc.Rect(0, 68, 16, 16);
            shield = new cc.Rect(37 * 17 + (Math.floor(Math.random() * 4) * 17), 0 + (Math.floor(Math.random() * 3) * 17), 16, 16);
            break;
          case 'chainmail':
            shirt = new cc.Rect(13 * 17, 4 * 17, 16, 16);
            pants = new cc.Rect(3 * 17, 1 * 17, 16, 16);
            hat = new cc.Rect(0, 68, 16, 16);
            shield = new cc.Rect(33 * 17 + (Math.floor(Math.random() * 4) * 17), 6 * 17 + (Math.floor(Math.random() * 3) * 17), 16, 16);
            break;
          case 'scale':
            shirt = new cc.Rect(12 * 17, 4 * 17, 16, 16);
            pants = new cc.Rect(3 * 17, 2 * 17, 16, 16);
            hat = new cc.Rect(28 * 17 + ((this.level % 2) * 2 * 17), 6 * 17, 16, 16);
            shield = new cc.Rect(37 * 17 + (Math.floor(Math.random() * 4) * 17), 3 * 17 + (Math.floor(Math.random() * 6) * 17), 16, 16);
            break;
          case 'plate':
            shirt = new cc.Rect(10 * 17, 9 * 17, 16, 16);
            pants = new cc.Rect(3 * 17, 3 * 17, 16, 16);
            hat = new cc.Rect(30 * 17 + ((this.level % 2) * 17), ((Math.floor(this.level / 2) % 2) * 17), 16, 16);
            shield = new cc.Rect(33 * 17 + (Math.floor(Math.random() * 4) * 17), 3 * 17 + (Math.floor(Math.random() * 3) * 17), 16, 16);
            break;
        }
        return [shirt, pants, hat, shield];
        break;
      case 'heavy_weapon':
        x = 17 * 47;
        y = 0;
        switch (this.subtype) {
          case 'mace':
            break;
          case 'flail':
            x += 17;
            break;
          case 'spear':
            x += 17 * 2;
            break;
          case 'maul':
            x += 17 * 3;
            break;
          case 'bardiche':
            x += 17 * 4;
            break;
          case 'battle axe':
            y += 17;
            break;
          case 'axe':
            y += 17;
            x += 17;
            break;
          case 'hammer':
            y += 17;
            x += 17 * 2;
            break;
          case 'scythe':
            y += 17;
            x += 17 * 3;
            break;
          case 'halberd':
            y += 17;
            x += 17 * 4;
            break;
        }
        switch (this.material) {
          case 'crude':
            break;
          case 'good':
            y += 17 * 2;
            break;
          case 'iron':
            y += 17 * 4;
            break;
          case 'steel':
            y += 17 * 6;
            break;
          case 'mithril':
            y += 17 * 8;
            break;
        }
        return new cc.Rect(x, y, 16, 16);
        break;
      case 'light_weapon':
        x = 17 * 42;
        y = 17 * 6;
        switch (this.material) {
          case 'wooden':
            break;
          case 'bronze':
            x += 17;
            break;
          case 'iron':
            x += 17 * 2;
            break;
          case 'steel':
            x += 17 * 3;
            break;
          case 'mithril':
            x += 17 * 4;
            break;
        }
        switch (this.subtype) {
          case 'sword':
            break;
          case 'dagger':
            y += 17;
            break;
          case 'falchion':
            y += 17 * 2;
            break;
          case 'scimitar':
            y += 17 * 3;
            break;
          case 'short bow':
            x = 17 * 52;
            y = 0;
            switch (this.material) {
              case 'wooden':
                break;
              case 'bronze':
                y += 17;
                break;
              case 'iron':
                y += 17 * 2;
                break;
              case 'steel':
                y += 17 * 3;
                break;
              case 'mithril':
                y += 17 * 4;
                break;
            }
            break;
          case 'long bow':
            x = 17 * 53;
            y = 0;
            switch (this.material) {
              case 'wooden':
                break;
              case 'bronze':
                y += 17;
                break;
              case 'iron':
                y += 17 * 2;
                break;
              case 'steel':
                y += 17 * 3;
                break;
              case 'mithril':
                y += 17 * 4;
                break;
            }
            break;
        }
        return new cc.Rect(x, y, 16, 16);
        break;
      case 'wand':
        x = 17 * 42;
        y = 0;
        switch (this.subtype) {
          case 'staff':
            break;
          case 'branch':
            x += 17;
            break;
          case 'wand':
            x += 17 * 2;
            break;
          case 'rod':
            x += 17 * 3;
            break;
          case 'scepter':
            x += 17 * 4;
            break;
        }
        switch (this.material) {
          case 'garnet':
            break;
          case 'sapphire':
            y += 17;
            break;
          case 'ruby':
            y += 17 * 2;
            break;
          case 'emerald':
            y += 17 * 3;
            break;
        }
        return new cc.Rect(x, y, 16, 16);
        break;
    }
  }

  // constructor
  var subtype_choices, material_choices, stat_choices;
  switch (type) {
    case 'armor':
      subtype_choices = ['armor'];
      //material_choices = ['leather', 'studded', 'chainmail', 'scale', 'plate'];
      stat_choices = ['ac'];
      break;
    case 'light_weapon':
      subtype_choices = ['sword', 'dagger', 'falchion', 'scimitar', 'short bow', 'long bow'];
      //material_choices = ['wooden', 'bronze', 'iron', 'steel', 'mithril'];
      stat_choices = ['dexterity'];
      break;
    case 'heavy_weapon':
      subtype_choices = ['mace', 'flail', 'spear', 'maul', 'bardiche', 'battle axe', 'axe', 'hammer', 'scythe', 'halberd'];
      //material_choices = ['crude', 'good', 'iron', 'steel', 'mithril'];
      stat_choices = ['strength'];
      break;
    case 'wand':
      subtype_choices = ['staff', 'branch', 'wand', 'rod', 'scepter'];
      //material_choices = ['garnet', 'sapphire', 'ruby', 'emerald'];
      stat_choices = ['intelligence'];
      break;
    case 'jewelry':
      subtype_choices = ['ring','necklace','amulet','brooch','trinket'];
      //material_choices = ['amethyst', 'sapphire', 'ruby', 'diamond'];
      stat_choices = ['strength', 'dexterity', 'intelligence', 'ac'];
      break;
  }
  this.subtype = choice(subtype_choices);
  //this.material = choice(material_choices.slice(0, this.level));
  this.material = choice(this.materials[this.type].slice(0, this.level));
  var stat = choice(stat_choices);
  switch (stat) {
    case 'strength':
      this.strength = this.level;
      break;
    case 'dexterity':
      this.dexterity = this.level;
      break;
    case 'intelligence':
      this.intelligence = this.level;
      break;
    case 'ac':
      this.ac = this.level;
      break;
  }
  this.durability = this.level + 10;
  if (this.type == 'jewelry' || Math.floor(Math.random() * (20 - this.level)) <= 0) {
    this.suffix = " of " + choice(synonyms[stat]);
    this.durability *= 2;
    this.suffix 
  }
};
var Player = function() {
  this.name = "";
  this.visible = true;
  this.sprites = [];
  this.portraits = [];
  this.x = null;
  this.y = null;
  this.delay = 0;
  this.state = null;
  this.dest = null;
  this.path = null;
  this.move_tries = null;
  this.strength = 0;
  this.intelligence = 0;
  this.dexterity = 0;
  this.hp = 0;
  this.mp = 0;
  this.ac = 0;
  this.level = 1;
  this.xp = 0;
  this.gold = 0;
  this.action = "";
  this.monster = null;
  this.items = [];
  this.max_items = 6;
  this.healPotions = 0;
  this.manaPotions = 0;
  this.primary = null;
  this.secondary = null;
  this.tertiary = null;
  this.spells = [];

  this.abilityRoll = function() {
    var roll = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
    roll.sort();
    return roll[1] + roll[2] + roll[3];
  };

  // class functions
  this.setVisible = function(visible) {
    this.visible = visible;
    var iSprites = this.sprites.length;
    while (iSprites--) {
      this.sprites[iSprites].setVisible(visible);
    }
  };
  this.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    var iSprites = this.sprites.length;
    while (iSprites--) {
      this.sprites[iSprites].setPosition(x * Game.map.getTileSize().width + (Game.map.getTileSize().width / 2), y * Game.map.getTileSize().height + (Game.map.getTileSize().height / 2));
    }
  };
  this.max_hp = function() {
    return this.strength + this.dexterity;
  };
  this.max_mp = function() {
    return this.intelligence * 2;
  };
  this.get_strength = function() {
    return this.strength +
      (this.primary === null ? 0 : this.primary.strength) +
      (this.secondary === null ? 0 : this.secondary.strength) +
      (this.tertiary === null ? 0 : this.tertiary.strength);
  };
  this.get_dexterity = function() {
    return this.dexterity +
      (this.primary === null ? 0 : this.primary.dexterity) +
      (this.secondary === null ? 0 : this.secondary.dexterity) +
      (this.tertiary === null ? 0 : this.tertiary.dexterity);
  };
  this.get_intelligence = function() {
    return this.intelligence +
      (this.primary === null ? 0 : this.primary.intelligence) +
      (this.secondary === null ? 0 : this.secondary.intelligence) +
      (this.tertiary === null ? 0 : this.tertiary.intelligence);
  };
  this.get_ac = function() {
    return this.ac +
      (this.primary === null ? 0 : this.primary.ac) +
      (this.secondary === null ? 0 : this.secondary.ac) +
      (this.tertiary === null ? 0 : this.tertiary.ac);
  };
  this.can_use = function(item) {
    switch (item.type) {
      case 'armor':
        return this.player_class == 'Fighter' || this.player_class == 'Thief';
        break;
      case 'heavy_weapon':
        return this.player_class == 'Fighter';
        break;
      case 'light_weapon':
        return true;
        break;
      case 'wand':
        return this.player_class == 'Wizard';
        break;
      case 'jewelry':
        return true;
        break;
    }
    return false;
  };
  this.equip = function(item) {
    switch (this.player_class) {
      case 'Fighter':
        switch (item.type) {
          case 'light_weapon':
          case 'heavy_weapon':
            this.primary = item;
            // sword or whatever
            this.sprites[5].setTextureRect(item.getTextureRect());
            //this.portraits[5].setTextureRect(item.getTextureRect());
            break;
          case 'armor':
            this.secondary = item;
            var rects = item.getTextureRect();
            // armor shirt
            this.sprites[1].setTextureRect(rects[0]);
            //this.portraits[2].setTextureRect(rects[0]);
            // armor pants
            this.sprites[2].setTextureRect(rects[1]);
            //this.portraits[3].setTextureRect(rects[1]);
            // armor helmet
            this.sprites[4].setTextureRect(rects[2]);
            //this.portraits[4].setTextureRect(rects[2]);
            // armor shield
            this.sprites[7].setTextureRect(rects[3]);
            //this.portraits[7].setTextureRect(rects[3]);
            break;
          case 'jewelry':
            this.tertiary = item;
            break;
          default:
            return false;
        }
        break;
      case 'Thief':
        switch (item.type) {
          case 'light_weapon':
            if (this.primary === null || this.primary.durability == 0 || item.level > this.primary.level) {
              // try primary first, since this is the only thing that goes
              this.primary = item;
              this.sprites[5].setTextureRect(item.getTextureRect());
              //this.portraits[5].setTextureRect(item.getTextureRect());
            } else {
              this.secondary = item;
              this.sprites[6].setTextureRect(item.getTextureRect());
              //this.portraits[6].setTextureRect(item.getTextureRect());
              // clear any armor secondaries
              this.sprites[1].setTextureRect(cc.rect(14 * 17, 5 * 17, 16, 16));
              //this.portraits[2].setTextureRect(cc.rect(14 * 17, 5 * 17, 16, 16));
              this.sprites[2].setTextureRect(cc.rect(3 * 17, 0 * 17, 16, 16));
              //this.portraits[3].setTextureRect(cc.rect(3 * 17, 0 * 17, 16, 16));
              this.sprites[4].setTextureRect(cc.rect(0, 68, 16, 16));
              //this.portraits[4].setTextureRect(cc.rect(0, 68, 16, 16));
              this.sprites[7].setTextureRect(cc.rect(0, 68, 16, 16));
              //this.portraits[7].setTextureRect(cc.rect(0, 68, 16, 16));
            }
            break;
          case 'armor':
            // armor is always secondary
            this.secondary = item;
            var rects = item.getTextureRect();
            // armor shirt
            this.sprites[1].setTextureRect(rects[0]);
            //this.portraits[2].setTextureRect(rects[0]);
            // armor pants
            this.sprites[2].setTextureRect(rects[1]);
            //this.portraits[3].setTextureRect(rects[1]);
            // armor helmet
            this.sprites[4].setTextureRect(rects[2]);
            //this.portraits[4].setTextureRect(rects[2]);
            // armor shield
            this.sprites[7].setTextureRect(rects[3]);
            //this.portraits[7].setTextureRect(rects[3]);
            // clear any weapon secondaries
            this.sprites[6].setTextureRect(cc.rect(0, 68, 16, 16));
            //this.portraits[6].setTextureRect(cc.rect(0, 68, 16, 16));
            break;
          case 'jewelry':
            if (this.tertiary === null || this.tertiary.durability == 0 || item.level > this.tertiary.level) {
              // try tertiary first, since this is the only thing that goes
              this.tertiary = item;
            } else {
              this.secondary = item;
              // clear any armor secondaries
              this.sprites[1].setTextureRect(cc.rect(14 * 17, 5 * 17, 16, 16));
              //this.portraits[2].setTextureRect(cc.rect(14 * 17, 5 * 17, 16, 16));
              this.sprites[2].setTextureRect(cc.rect(3 * 17, 0 * 17, 16, 16));
              //this.portraits[3].setTextureRect(cc.rect(3 * 17, 0 * 17, 16, 16));
              this.sprites[4].setTextureRect(cc.rect(0, 68, 16, 16));
              //this.portraits[4].setTextureRect(cc.rect(0, 68, 16, 16));
              this.sprites[7].setTextureRect(cc.rect(0, 68, 16, 16));
              //this.portraits[7].setTextureRect(cc.rect(0, 68, 16, 16));
              // clear any weapon secondaries
              this.sprites[6].setTextureRect(cc.rect(0, 68, 16, 16));
              //this.portraits[6].setTextureRect(cc.rect(0, 68, 16, 16));
            }
            break;
          default:
            return false;
        }
        break;
      case 'Wizard':
        switch (item.type) {
          case 'wand':
            this.primary = item;
            // wand/staff
            this.sprites[5].setTextureRect(item.getTextureRect());
            //this.portraits[5].setTextureRect(item.getTextureRect());
            break;
          case 'light_weapon':
            this.secondary = item;
            // sword
            this.sprites[6].setTextureRect(item.getTextureRect());
            //this.portraits[6].setTextureRect(item.getTextureRect());
            break;
          case 'jewelry':
            this.tertiary = item;
            break;
          default:
            return false;
        }
        break;
    }
    this.setPortraits();
  };
  this.is_better = function(item) {
    switch (this.player_class) {
      case 'Fighter':
        switch (item.type) {
          case 'heavy_weapon':
          case 'light_weapon':
            return this.primary === null || this.primary.durability == 0 || this.primary.level < item.level;
            break;
          case 'armor':
            return this.secondary === null || this.secondary.durability == 0 || this.secondary.level < item.level;
            break;
          case 'jewelry':
            return this.tertiary === null || this.tertiary.durability == 0 || this.tertiary.level < item.level;
            break;
          default:
            return false;
        }
        break;
      case 'Thief':
        switch (item.type) {
          case 'armor':
            return this.secondary === null || this.secondary.durability == 0 || this.secondary.level < item.level;
          case 'light_weapon':
            return this.primary === null || this.primary.durability == 0 || this.primary.level < item.level || this.secondary === null || this.secondary.durability == 0 || this.secondary.level < item.level;
            break;
          case 'jewelry':
            return this.secondary === null || this.secondary.durability == 0 || this.secondary.level < item.level || this.tertiary === null || this.tertiary.durability == 0 || this.tertiary.level < item.level;
            break;
          default:
            return false;
        }
        break;
      case 'Wizard':
        switch (item.type) {
          case 'wand':
            return this.primary === null || this.primary.durability == 0 || this.primary.level < item.level;
            break;
          case 'light_weapon':
            return this.secondary === null || this.secondary.durability == 0 || this.secondary.level < item.level;
            break;
          case 'jewelry':
            return this.tertiary === null || this.tertiary.durability == 0 || this.tertiary.level < item.level;
            break;
          default:
            return false;
        }
        break;
    }
  };
  this.next_level = function() {
    return this.level * 25;
  };
  this.level_up = function() {
    this.xp = 0;
    this.level++;
    // 1 point roughly every other level
    this.ac += Math.max(0, Math.floor(Math.random() * 2));
    // upgrade spells
    iSpell = Math.floor(Math.random() * this.spells.length);
    var spellName = this.spells[iSpell].split(' ');
    var spellLevel = deromanize(spellName[spellName.length - 1]);
    if (spellLevel) {
      spellName[spellName.length - 1] = romanize(spellLevel + 1);
    } else {
      spellName.push('II');
    }
    this.spells[iSpell] = spellName.join(' ');
    switch (this.player_class) {
      case 'Fighter':
        // 1 point every level
        this.strength++;
        // 1 point roughly every other level
        this.dexterity += Math.floor(Math.random() * 2);
        // 1 point roughly every third level
        this.intelligence += Math.max(0, Math.floor(Math.random() * 3) - 1);
        this.spells.push(Game.fighterSpellMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' '));
        break;
      case 'Thief':
        this.dexterity++;
        this.intelligence += Math.floor(Math.random() * 2);
        this.strength += Math.max(0, Math.floor(Math.random() * 3) - 1);
        this.spells.push(Game.thiefSpellMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' '));
        break;
      case 'Wizard':
        this.intelligence++;
        this.strength += Math.floor(Math.random() * 2);
        this.dexterity += Math.max(0, Math.floor(Math.random() * 3) - 1);
        this.spells.push(Game.wizardSpellMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' '));
        break;
    }
  };
  this.cast_cost = function() {
    return Math.ceil((this.get_intelligence() + this.level) / 10);
  };
  this.cast_damage = function() {
    // level 1, 18 int = 1-18
    // level 2           1-10 * 2 (2-20)
    // level 3           1-7 * 3 (3-24)
    // level 10          1-3 * 10 (10-30)
    // level 1, 12 int = 1-13
    // level 2           1-7 * 2 (2-14)
    // level 3           1-5 * 3 (3-15)
    // level 10          1-3 * 10 (10-30)
    // level 1, 6 int = 1-6
    // level 2          1-4 * 2 (2-8)
    // level 3          1-3 * 3 (3-9)
    // level 10         1-2 * 10 (10-20)
    var iLevel = this.level, dmg = 0;
    while (iLevel--) {
      dmg += Math.ceil(Math.random() * (this.get_intelligence() / this.level + 1));
    }
    return dmg;
  };
  this.done_adventuring = function() {
    return (
          (this.items.length / this.max_items) +
          ((this.max_hp() - this.hp) / this.max_hp() / (this.healPotions + 1)) +
          ((this.max_mp() - this.mp) / this.max_mp() / (this.manaPotions + 1))
        ) >= 0.7;
  };
  this.setPortraits = function() {
    var iSprite = this.sprites.length, sprite;
    while(iSprite--) {
      sprite = this.sprites[iSprite];
      this.portraits[iSprite].setTextureRect(cc.rect(sprite.getTextureRect().x * 2, sprite.getTextureRect().y * 2, sprite.getTextureRect().width * 2, sprite.getTextureRect().height * 2));
    }
  };

  /* constructor */
  this.strength = this.abilityRoll();
  this.dexterity = this.abilityRoll();
  this.intelligence = this.abilityRoll();
  // determine class
  var class_chances = [];
  for (var i = 0; i < this.strength; i++) {
    class_chances.push('Fighter');
  }
  for (var i = 0; i < this.dexterity; i++) {
    class_chances.push('Thief');
  }
  for (var i = 0; i < this.intelligence; i++) {
    class_chances.push('Wizard');
  }
  this.player_class = class_chances[Math.floor(Math.random() * class_chances.length)];

  // set sprite
  // 0: skin
  this.sprites[0] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(Math.floor(Math.random() * 2) * 17, Math.floor(Math.random() * 4) * 17, 16, 16));
  // 1: hair
  var hair_x, hair_y;
  // initiall set x,y for the style, defaulting within brown hair
  hair_x = (Math.floor(Math.random() * 4) + 19) * 17;
  hair_y = Math.floor(Math.random() * 4) * 17;
  // now adjust for color (lower right is transparent for bald)
  hair_x += Math.floor(Math.random() * 2) * 17;
  hair_y += Math.floor(Math.random() * 3) * 17;
  this.sprites[3] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(hair_x, hair_y, 16, 16));
  switch (this.player_class) {
    case 'Fighter':
      while (this.name == "" || this.name.length > 14) {
        this.name = Game.fighterNameMarkov.make_title(1).replace(/ /g, '');
      }
      // shirt (red shoulder sling)
      this.sprites[1] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(6 * 17, 1 * 17, 16, 16));
      // pants (none)
      this.sprites[2] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // hat (none)
      this.sprites[4] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // weapon (none)
      this.sprites[5] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // weapon 2 (none)
      this.sprites[6] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      this.sprites[6].setFlippedX(true);
      // shield (none)
      this.sprites[7] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      this.spells.push(Game.fighterSpellMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' '));
      break;
    case 'Thief':
      while (this.name == "" || this.name.length > 14) {
        this.name = Game.thiefNameMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' ');
      }
      // shirt (black tunic)
      this.sprites[1] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(14 * 17, 5 * 17, 16, 16));
      // pants (black)
      this.sprites[2] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(3 * 17, 0 * 17, 16, 16));
      // hat (none)
      this.sprites[4] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // weapon (none)
      this.sprites[5] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // weapon 2 (none)
      this.sprites[6] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      this.sprites[6].setFlippedX(true);
      // shield (none)
      this.sprites[7] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      this.spells.push(Game.thiefSpellMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' '));
      break;
    case 'Wizard':
      while (this.name == "" || this.name.length > 14) {
        this.name = Game.wizardNameMarkov.make_title(1).replace(/ /g, '');
      }
      // shirt (purple robe)
      this.sprites[1] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(15 * 17, 2 * 17, 16, 16));
      // pants (none)
      this.sprites[2] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // hat (none)
      this.sprites[4] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // weapon 1 (none)
      this.sprites[5] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      // weapon 2 (none)
      this.sprites[6] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      this.sprites[6].setFlippedX(true);
      // shield (none)
      this.sprites[7] = cc.Sprite.create(res.roguelikeChar_png, cc.rect(0, 68, 16, 16));
      this.spells.push(Game.wizardSpellMarkov.make_title(1).replace(/ /g, '').replace(/_/g, ' '));
      break;
  }
  // set portrait
  var iSprite = this.sprites.length, sprite;
  while(iSprite--) {
    sprite = this.sprites[iSprite];
    this.portraits[iSprite] = cc.Sprite.create(res.roguelikeChar_x2_png, cc.rect(sprite.getTextureRect().x * 2, sprite.getTextureRect().y * 2, sprite.getTextureRect().width * 2, sprite.getTextureRect().height * 2));
    this.portraits[iSprite].setPosition(Game.ui.portrait["x"] + Game.ui.portrait["width"] / 2, Game.ui.portrait["y"] + Game.ui.portrait["height"] / 2);
    this.portraits[iSprite].setVisible(false);
    this.portraits[iSprite].setFlippedX(sprite.flippedX);
  }

  this.hp = this.max_hp();
  this.mp = this.max_mp();
};

var Game = {
  scene: null,
  map: null,
  meta: null,
  nighttime: null,
  objectGroup: null,
  uiGroup: null,
  buttonGroup: null,
  playerLeftButton: null,
  playerRightButton: null,
  logFirstButton: null,
  logPreviousButton: null,
  logNextButton: null,
  logLastButton: null,
  healPotionsPriceUpButton: null,
  healPotionsPriceDownButton: null,
  manaPotionsPriceUpButton: null,
  manaPotionsPriceDownButton: null,
  itemsPriceUpButton: null,
  itemsPriceDownButton: null,
  armorPriceUpButton: null,
  armorPriceDownButton: null,
  heavyWeaponsPriceUpButton: null,
  heavyWeaponsPriceDownButton: null,
  lightWeaponsPriceUpButton: null,
  lightWeaponsPriceDownButton: null,
  wandsPriceUpButton: null,
  wandsPriceDownButton: null,
  jewelryPriceUpButton: null,
  jewelryPriceDownButton: null,
  speedPauseButton: null,
  speedNormalButton: null,
  speedFastButton: null,
  speedFasterButton: null,
  speedDrawNode: null,
  fighterNameMarkov: null,
  thiefNameMarkov: null,
  wizardNameMarkov: null,
  monsterMarkov: null,
  fighterSpellMarkov: null,
  wizardSpellMarkov: null,
  thiefSpellMarkov: null,
  shopkeeperScriptMarkov: null,
  showDialog: false,
  ui: {
    logo: null,
    gold: null,
    heroName: null,
    heroStats: null,
    heroStatus: null,
  },
  tooltip: null,
  player_walk_speed: 40,
  player_action_speed: 200,
  pause: 1,
  speed: 2,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  players: [],
  selectedPlayer: 0,
  items: [],
  potion_wholesale: 2,
  healPotionsPrice: 3,
  manaPotionsPrice: 3,
  itemsPrice: 5,
  healPotions: 0,
  manaPotions: 0,
  gold: 100,
  quest_wholesale: 50,
  buy_price: {
    "armor": 2,
    "heavy_weapon": 2,
    "light_weapon": 2,
    "wand": 2,
    "jewelry": 2
  },
  heal_potion_power: 6,
  mana_potion_power: 6,
  levels: [],
  cast_delay: 3,
  item_chance: 11,
  degrade_chance: 20,
  player_quest_chance: 30000,
  max_items: 25,
  log: [],
  log_page: 0,
  max_log: 8,
  morning_hour: 6,
  evening_hour: 18,
  quests: 0,

  init: function(gameCanvas) {
    Game.fighterNameMarkov = new Markov(fighterNamesList);
    Game.thiefNameMarkov = new Markov(thiefNamesList);
    Game.wizardNameMarkov = new Markov(wizardNamesList);
    Game.monsterMarkov = new Markov(monstersList);
    Game.fighterSpellMarkov = new Markov(fighterSpellList);
    Game.thiefSpellMarkov = new Markov(thiefSpellList);
    Game.wizardSpellMarkov = new Markov(wizardSpellList);
    Game.shopkeeperScriptMarkov = new Markov(shopkeeperScripts);

    cc.game.onStart = function(){
      //load resources
      cc.LoaderScene.preload(g_resources, function() {
        var WonScene = cc.Scene.extend({
          ctor: function() {
            this._super();
            this.init();
          },
          onEnter: function () {
            this._super();
            // play music
            cc.audioEngine.playMusic(res.music_vindsvept_ogg, true);

            // build start menu
            var size = cc.director.getWinSize();

            var bg = cc.Sprite.create(res.startBackground_png);
            bg.setPosition(size.width / 2, size.height / 2);
            bg.setScale(1);
            this.addChild(bg, 0);

            var title = cc.LabelTTF.create("You Won!", res.diablo_heavy_ttf, 50);
            title.setPosition(size.width / 2, size.height * 2/3);
            title.fillStyle = new cc.Color(195, 0, 0);
            title.enableStroke(new cc.Color(0, 0, 0), 4);
            this.addChild(title);

            var startMenu = cc.Menu.create();
            var startLabel = cc.LabelTTF.create("New Game", res.diablo_heavy_ttf, 24);
            startLabel.fillStyle = new cc.Color(195, 0, 0);
            startLabel.enableStroke(new cc.Color(0, 0, 0), 4);
            var startButton = cc.MenuItemLabel.create(
              startLabel,
              function() {
                Game.scene = new MyScene();
                cc.director.runScene(Game.scene);
              },
              this
            );
            startButton.setPosition(0, 0 - size.height / 6);
            startMenu.addChild(startButton);
            startMenu.setPosition(size.width / 2, size.height / 2);
            this.addChild(startMenu);
          },
        });
        var LostScene = cc.Scene.extend({
          ctor: function() {
            this._super();
            this.init();
          },
          onEnter: function () {
            this._super();
            // play music
            cc.audioEngine.playMusic(res.music_vindsvept_ogg, true);

            // build start menu
            var size = cc.director.getWinSize();

            var bg = cc.Sprite.create(res.startBackground_png);
            bg.setPosition(size.width / 2, size.height / 2);
            bg.setScale(1);
            this.addChild(bg, 0);

            var title = cc.LabelTTF.create("You Lost!", res.diablo_heavy_ttf, 50);
            title.setPosition(size.width / 2, size.height * 2/3);
            title.fillStyle = new cc.Color(195, 0, 0);
            title.enableStroke(new cc.Color(0, 0, 0), 4);
            this.addChild(title);

            var startMenu = cc.Menu.create();
            var startLabel = cc.LabelTTF.create("New Game", res.diablo_heavy_ttf, 24);
            startLabel.fillStyle = new cc.Color(195, 0, 0);
            startLabel.enableStroke(new cc.Color(0, 0, 0), 4);
            var startButton = cc.MenuItemLabel.create(
              startLabel,
              function() {
                Game.scene = new MyScene();
                cc.director.runScene(Game.scene);
              },
              this
            );
            startButton.setPosition(0, 0 - size.height / 6);
            startMenu.addChild(startButton);
            startMenu.setPosition(size.width / 2, size.height / 2);
            this.addChild(startMenu);
          },
        });
        var StartScene = cc.Scene.extend({
          ctor: function() {
            this._super();
            this.init();
          },
          onEnter: function () {
            this._super();
            // play music
            cc.audioEngine.playMusic(res.music_vindsvept_ogg, true);

            // build start menu
            var size = cc.director.getWinSize();

            var bg = cc.Sprite.create(res.startBackground_png);
            bg.setPosition(size.width / 2, size.height / 2);
            bg.setScale(1);
            this.addChild(bg, 0);

            var title = cc.LabelTTF.create("Tristram", res.diablo_heavy_ttf, 50);
            title.setPosition(size.width / 2, size.height * 2/3);
            title.fillStyle = new cc.Color(195, 0, 0);
            title.enableStroke(new cc.Color(0, 0, 0), 4);
            this.addChild(title);

            var startMenu = cc.Menu.create();
            var spLabel = cc.LabelTTF.create("Single-Player Game", res.diablo_heavy_ttf, 24);
            spLabel.fillStyle = new cc.Color(195, 0, 0);
            spLabel.enableStroke(new cc.Color(0, 0, 0), 4);
            var startLabel = cc.LabelTTF.create("Zero-Player Game", res.diablo_heavy_ttf, 24);
            startLabel.fillStyle = new cc.Color(195, 0, 0);
            startLabel.enableStroke(new cc.Color(0, 0, 0), 4);
            var startButton = cc.MenuItemLabel.create(
              startLabel,
              function() {
                Game.scene = new MyScene();
                cc.director.runScene(Game.scene);
              },
              this
            );
            startButton.setPosition(0, 0 - size.height / 6 - 50);
            var spButton = cc.MenuItemLabel.create(
              spLabel,
              function() {
                spLabel.setString("Omitted");
                spButton.setEnabled(false);
              },
              this
            );
            spButton.setPosition(0, 0 - size.height / 6);
            spButton.setDisabledColor(new cc.Color(100, 100, 100));
            startMenu.addChild(spButton);
            startMenu.addChild(startButton);
            startMenu.setPosition(size.width / 2, size.height / 2);
            this.addChild(startMenu);
          },
        });
        var MyScene = cc.Scene.extend({
          ctor: function() {
            this._super();
            this.init();
          },
          onEnter: function () {
            this._super();
            // play music
            /*
             */
            var mapNum = Math.ceil(Math.random() * 2);
            if (mapNum == 1) {
              Game.map = cc.TMXTiledMap.create(res.tristram_map1_tmx);
            } else {
              Game.map = cc.TMXTiledMap.create(res.tristram_map2_tmx);
            }
            this.addChild(Game.map, 0);
            Game.uiMap = cc.TMXTiledMap.create(res.tristram_ui_tmx);
            this.addChild(Game.uiMap, 0);

            Game.meta = Game.map.getLayer("Meta");
            Game.meta.setVisible(false);
            Game.nighttime = Game.map.getLayer("Nighttime");
            Game.nighttime.setVisible(false);
            Game.buttons = Game.uiMap.getLayer("Buttons");

            Game.objectGroup = Game.map.getObjectGroup("Objects");
            Game.uiGroup = Game.uiMap.getObjectGroup("UI-Objects");
            Game.buttonGroup = Game.uiMap.getObjectGroup("Button-Objects");
            Game.playerLeftButton = Game.buttonGroup.getObject("PlayerLeft");
            Game.playerRightButton = Game.buttonGroup.getObject("PlayerRight");
            Game.logFirstButton = Game.buttonGroup.getObject("LogFirst");
            Game.logPreviousButton = Game.buttonGroup.getObject("LogPrevious");
            Game.logNextButton = Game.buttonGroup.getObject("LogNext");
            Game.logLastButton = Game.buttonGroup.getObject("LogLast");
            Game.healPotionsPriceUpButton = Game.buttonGroup.getObject("HealPotionsPriceUp");
            Game.healPotionsPriceDownButton = Game.buttonGroup.getObject("HealPotionsPriceDown");
            Game.manaPotionsPriceUpButton = Game.buttonGroup.getObject("ManaPotionsPriceUp");
            Game.manaPotionsPriceDownButton = Game.buttonGroup.getObject("ManaPotionsPriceDown");
            Game.itemsPriceUpButton = Game.buttonGroup.getObject("ItemsPriceUp");
            Game.itemsPriceDownButton = Game.buttonGroup.getObject("ItemsPriceDown");
            Game.armorPriceUpButton = Game.buttonGroup.getObject("ArmorPriceUp");
            Game.armorPriceDownButton = Game.buttonGroup.getObject("ArmorPriceDown");
            Game.heavyWeaponsPriceUpButton = Game.buttonGroup.getObject("HeavyWeaponsPriceUp");
            Game.heavyWeaponsPriceDownButton = Game.buttonGroup.getObject("HeavyWeaponsPriceDown");
            Game.lightWeaponsPriceUpButton = Game.buttonGroup.getObject("LightWeaponsPriceUp");
            Game.lightWeaponsPriceDownButton = Game.buttonGroup.getObject("LightWeaponsPriceDown");
            Game.wandsPriceUpButton = Game.buttonGroup.getObject("WandsPriceUp");
            Game.wandsPriceDownButton = Game.buttonGroup.getObject("WandsPriceDown");
            Game.jewelryPriceUpButton = Game.buttonGroup.getObject("JewelryPriceUp");
            Game.jewelryPriceDownButton = Game.buttonGroup.getObject("JewelryPriceDown");
            Game.speedPauseButton = Game.buttonGroup.getObject("SpeedPause");
            Game.speedNormalButton = Game.buttonGroup.getObject("SpeedNormal");
            Game.speedFastButton = Game.buttonGroup.getObject("SpeedFast");
            Game.speedFasterButton = Game.buttonGroup.getObject("SpeedFaster");
            Game.speedDrawNode = cc.DrawNode.create();
            this.addChild(Game.speedDrawNode, 0);
            Game.speedDrawNode.drawRect(cc.p(Game.speedNormalButton["x"], Game.speedNormalButton["y"]), cc.p(Game.speedNormalButton["x"] + Game.speedNormalButton["width"], Game.speedNormalButton["y"] + Game.speedNormalButton["height"]), null, 1, cc.color(0, 200, 0));

            var size = cc.director.getWinSize();
            Game.dialog = cc.Sprite.create(res.dialog_png);
            Game.dialog.setPosition(size.width / 2, size.height / 2);
            Game.dialog.setScale(1);
            Game.dialog.setVisible(false);
            this.addChild(Game.dialog, 0);
            Game.dialogText = cc.LabelTTF.create("Dialog", res.diablo_heavy_ttf, 14, cc.size(Game.dialog.width * 0.66, Game.dialog.height * 0.5));
            Game.dialogText.setPosition(size.width / 2, size.height / 2 + 30);
            Game.dialogText.zIndex = 999;
            Game.dialogText.setVisible(false);
            Game.dialogText.fillStyle = new cc.Color(0, 0, 0);
            this.addChild(Game.dialogText);

            Game.dialogMenu = cc.Menu.create();

            var continueLabel = cc.LabelTTF.create("Continue", res.diablo_heavy_ttf, 16);
            continueLabel.fillStyle = new cc.Color(0, 0, 0);
            var continueButton = cc.MenuItemLabel.create(continueLabel, Game.dialogContinue, this);
            continueButton.setPosition(Game.dialog.width / 2 - 140, 0 - Game.dialog.height / 2 + 50);

            var buyHealPotionsLabel = cc.LabelTTF.create("Buy Healing Potion: " + Game.potion_wholesale + "g", res.diablo_heavy_ttf, 16);
            Game.ui.buyHealPotionsButton = cc.MenuItemLabel.create(buyHealPotionsLabel, function() { Game.buyHealPotions(1); }, this);
            Game.ui.buyHealPotionsButton.setPosition(-40, -60);
            Game.ui.buyHealPotionsButton.setColor(new cc.Color(0, 0, 0));
            Game.ui.buyHealPotionsButton.setDisabledColor(new cc.Color(100, 100, 100));

            var buyManaPotionsLabel = cc.LabelTTF.create("Buy Mana Potion: " + Game.potion_wholesale + "g", res.diablo_heavy_ttf, 16);
            Game.ui.buyManaPotionsButton = cc.MenuItemLabel.create(buyManaPotionsLabel, function() { Game.buyManaPotions(1); }, this);
            Game.ui.buyManaPotionsButton.setPosition(-40, -80);
            Game.ui.buyManaPotionsButton.setColor(new cc.Color(0, 0, 0));
            Game.ui.buyManaPotionsButton.setDisabledColor(new cc.Color(100, 100, 100));


            var buyTenHealPotionsLabel = cc.LabelTTF.create("x10", res.diablo_heavy_ttf, 16);
            Game.ui.buyTenHealPotionsButton = cc.MenuItemLabel.create(buyTenHealPotionsLabel, function() { Game.buyHealPotions(10); }, this);
            Game.ui.buyTenHealPotionsButton.setPosition(130, -60);
            Game.ui.buyTenHealPotionsButton.setColor(new cc.Color(0, 0, 0));
            Game.ui.buyTenHealPotionsButton.setDisabledColor(new cc.Color(100, 100, 100));


            var buyTenManaPotionsLabel = cc.LabelTTF.create("x10", res.diablo_heavy_ttf, 16);
            Game.ui.buyTenManaPotionsButton = cc.MenuItemLabel.create(buyTenManaPotionsLabel, function() { Game.buyManaPotions(10); }, this);
            Game.ui.buyTenManaPotionsButton.setPosition(120, -80);
            Game.ui.buyTenManaPotionsButton.setColor(new cc.Color(0, 0, 0));
            Game.ui.buyTenManaPotionsButton.setDisabledColor(new cc.Color(100, 100, 100));


            var buyQuestsLabel = cc.LabelTTF.create("Create a quest: "  + Game.quest_wholesale + "g", res.diablo_heavy_ttf, 16);
            Game.ui.buyQuestsButton = cc.MenuItemLabel.create(buyQuestsLabel, Game.buyQuest, this);
            Game.ui.buyQuestsButton.setPosition(0, -100);
            Game.ui.buyQuestsButton.setColor(new cc.Color(0, 0, 0));
            Game.ui.buyQuestsButton.setDisabledColor(new cc.Color(100, 100, 100));


            Game.dialogMenu.addChild(continueButton);
            Game.dialogMenu.addChild(Game.ui.buyHealPotionsButton);
            Game.dialogMenu.addChild(Game.ui.buyManaPotionsButton);
            Game.dialogMenu.addChild(Game.ui.buyTenHealPotionsButton);
            Game.dialogMenu.addChild(Game.ui.buyTenManaPotionsButton);
            Game.dialogMenu.addChild(Game.ui.buyQuestsButton);
            Game.dialogMenu.setPosition(size.width / 2, size.height / 2);
            Game.dialogMenu.setVisible(false);
            this.addChild(Game.dialogMenu);

            Game.initUI();
            Game.initGame();

            Game.addPlayer();
            Game.selectPlayer(0);
            Game.hour = Game.morning_hour;
            this.scheduleUpdate();

            Game.wonGame = function() {
              Game.scene = new WonScene();
              cc.director.runScene(Game.scene);
            };
            Game.lostGame = function() {
              Game.scene = new LostScene();
              cc.director.runScene(Game.scene);
            };
          },
          update: function() {
            if (Game.players.length == 0) {
              Game.lostGame();
            }
            Game.updateUI();
            // draw speed indicator
            Game.speedDrawNode.clear();
            if (Game.pause == 0) {
              Game.speedDrawNode.drawRect(cc.p(Game.speedPauseButton["x"], Game.speedPauseButton["y"]), cc.p(Game.speedPauseButton["x"] + Game.speedPauseButton["width"], Game.speedPauseButton["y"] + Game.speedPauseButton["height"]), null, 1, cc.color(0, 200, 0));
              return;
            } else if (Game.speed >= 20) {
              Game.speedDrawNode.drawRect(cc.p(Game.speedFasterButton["x"], Game.speedFasterButton["y"]), cc.p(Game.speedFasterButton["x"] + Game.speedFasterButton["width"], Game.speedFasterButton["y"] + Game.speedFasterButton["height"]), null, 1, cc.color(0, 200, 0));
            } else if (Game.speed >= 5) {
              Game.speedDrawNode.drawRect(cc.p(Game.speedFastButton["x"], Game.speedFastButton["y"]), cc.p(Game.speedFastButton["x"] + Game.speedFastButton["width"], Game.speedFastButton["y"] + Game.speedFastButton["height"]), null, 1, cc.color(0, 200, 0));
            } else {
              Game.speedDrawNode.drawRect(cc.p(Game.speedNormalButton["x"], Game.speedNormalButton["y"]), cc.p(Game.speedNormalButton["x"] + Game.speedNormalButton["width"], Game.speedNormalButton["y"] + Game.speedNormalButton["height"]), null, 1, cc.color(0, 200, 0));
            }
            if (Game.showDialog) {
              // halt the game while showing dialog
              return;
            } else if (Game.second == 0 && Game.minute == 0 && Game.hour == Game.morning_hour) {
              Game.speed = 2;
              Game.playMusic();
              // add Game dialog
              // set text
              var dialogText = "A new day has begun!\n";
              if (Game.day == 1) {
                // first day, show intro text
                dialogText += "Since this is the first day of your shop, the shelves are empty.\nBuy some healing and mana potions to help your heroes in their journey (and make a bit of coin while you're at it).\nAny unsold potions will spoil at the end of the day, so don't buy too many.";
              } else {
                var healSpoil = Math.floor(Math.random() * Game.healPotions);
                var manaSpoil = Math.floor(Math.random() * Game.manaPotions);
                if (healSpoil > 0) {
                  dialogText += "\n" + healSpoil + " healing potions spoiled.";
                }
                if (manaSpoil > 0) {
                  dialogText += "\n" + manaSpoil + " mana potions spoiled.";
                }
                Game.healPotions -= healSpoil;
                Game.manaPotions -= manaSpoil;
              }
              // heal and wake players
              var iPlayer = Game.players.length, player;
              while (iPlayer--) {
                player = Game.players[iPlayer];
                if (player.state == "sleeping") {
                  player.state = "waking";
                  player.hp = player.max_hp();
                  player.mp = player.max_mp();
                }
              }
              // show it all
              Game.updateDialogButtons();
              Game.showDialog = true;
              Game.dialog.zIndex = 998;
              Game.dialog.setVisible(true);
              Game.dialogText.setString(dialogText);
              Game.dialogText.zIndex = 999;
              Game.dialogText.setVisible(true);
              Game.dialogMenu.zIndex = 999;
              Game.dialogMenu.setVisible(true);
              Game.updateUI();
            }
            Game.second += Game.getSpeed();
            if (Game.second >= 60) {
              Game.second = 0;
              Game.minute++;
            }
            if (Game.minute >= 60) {
              Game.minute = 0;
              Game.hour++;
            }
            if (Game.hour >= 24) {
              Game.day++;
              Game.hour = 0;
            }
            if (Game.hour >= Game.evening_hour || Game.hour < Game.morning_hour) {
              // nighttime mode
              Game.nighttime.setVisible(true);
            } else {
              Game.nighttime.setVisible(false);
              // check for new heroes during the day
              for (var ii = 0; ii < Game.speed; ii++) {
                // we loop on speed so faster games don't attract fewer
                if (Math.floor(Math.random() * Game.players.length * Game.player_quest_chance) < Game.quests) {
                  Game.addPlayer("for a quest!");
                  Game.selectPlayer(0);
                }
              }
            }
            var awake = false;
            var iPlayer = Game.players.length, player, playerPos = null;
            while (iPlayer--) {
              player = Game.players[iPlayer];
              if (player.state != "sleeping") {
                awake = true;
              }
              if (player.delay <= 0) {
                // check for level up
                if (player.xp >= player.next_level()) {
                  player.level_up();
                  player.action = "DING! Reached level " + player.level + "!";
                  player.hp = player.max_hp();
                  player.mp = player.max_mp();
                  player.delay += Game.player_action_speed;
                  continue;
                }
                if (player.state == "adventuring" || (Game.hour >= Game.morning_hour && Game.hour < Game.evening_hour)) {
                  // check to drink potions
                  if (player.max_hp() - player.hp > Game.heal_potion_power && player.healPotions > 0) {
                    player.healPotions--;
                    var heal = Math.ceil(Math.random() * Game.heal_potion_power);
                    player.hp += heal;
                    player.action = "Quaffed healing potion and healed " + heal;
                    player.delay += Game.player_action_speed;
                    break;
                  } else if (player.max_mp() - player.mp > Game.mana_potion_power && player.manaPotions > 0) {
                    player.manaPotions--;
                    var heal = Math.ceil(Math.random() * Game.mana_potion_power);
                    player.mp += heal;
                    player.action = "Quaffed mana potion and restored " + heal;
                    player.delay += Game.player_action_speed;
                    break;
                  }
                }
                switch (player.state) {
                  case "route-bed":
                    if (player.path === null) {
                      // find a bed
                      var objects = Game.objectGroup.getObjects();
                      var iObjects = objects.length, object, dest = null, dest_x, dest_y;
                      while (iObjects--) {
                        object = objects[iObjects];
                        if (object["name"] == "Bed") {
                          dest = object;
                          dest_x = Math.floor(dest["x"] / Game.map.getTileSize().width);
                          dest_y = Math.floor(dest["y"] / Game.map.getTileSize().height);
                          var iiPlayer = Game.players.length, pl;
                          while (iiPlayer--) {
                            if (iiPlayer == iPlayer) {
                              continue;
                            }
                            pl = Game.players[iiPlayer];
                            if (pl.x == dest_x && pl.y == dest_y) {
                              // player already sleeping in this bed
                              dest = null;
                              break;
                            } else if (pl.path !== null && pl.path[pl.path.length - 1].x == dest_x && pl.path[pl.path.length - 1].y == dest_y) {
                              // player already pathing to this bed
                              dest = null;
                              break;
                            }
                          }
                        }
                        if (dest !== null) {
                          break;
                        }
                      }
                      if (dest === null) {
                        // no beds, blow this pop stand
                        Game.removePlayer(iPlayer, "because there are no more beds");
                        break;
                      } else {
                        // see if we hate it here
                        var worth = player.gold + player.hp + player.mp;
                        worth += player.primary === null ? 0 : player.primary.sell_price();
                        worth += player.secondary === null ? 0 : player.secondary.sell_price();
                        worth += player.tertiary === null ? 0 : player.tertiary.sell_price();
                        if (Math.floor(Math.random() * (worth / player.level + Game.hour)) == 0) {
                          // outta here
                          Game.removePlayer(iPlayer, "to find a better shop");
                        } else {
                          // go to bed!
                          player.action = "Going to bed";
                          player.path = findPath(player.x, player.y, dest_x, dest_y, Game.findNeighbors, Game.getDistance);
                        }
                      }
                    } else {
                      if (Game.movePlayer(player)) {
                        if (player.path.length == 0) {
                          player.action = "Sleeping";
                          player.state = "sleeping";
                          player.path = null;
                        }
                      }
                    }
                    break;
                  case "route-dungeon":
                    if (player.path === null) {
                      // find the dungeon
                      player.action = "Going to dungeon";
                      var dest = Game.objectGroup.getObject("DungeonPoint");
                      var x = Math.floor(dest["x"] / Game.map.getTileSize().width);
                      var y = Math.floor(dest["y"] / Game.map.getTileSize().height);
                      player.path = findPath(player.x, player.y, x, y, Game.findNeighbors, Game.getDistance);
                    } else {
                      if (Game.movePlayer(player)) {
                        if (player.path.length == 0) {
                          player.action = "Adventuring";
                          player.state = "adventuring";
                          player.path = null;
                          player.delay += Game.player_action_speed;
                        }
                      }
                    }
                    break;
                  case "route-shop":
                    player.setVisible(true);
                    if (player.path === null) {
                      // find the shop
                      player.action = "Going to shop";
                      var dest = Game.objectGroup.getObject("ShopPoint");
                      var x = Math.floor(dest["x"] / Game.map.getTileSize().width);
                      var y = Math.floor(dest["y"] / Game.map.getTileSize().height);
                      player.path = findPath(player.x, player.y, x, y, Game.findNeighbors, Game.getDistance);
                    } else {
                      if (Game.movePlayer(player)) {
                        if (player.path.length == 0) {
                          player.action = "Shopping";
                          player.state = "buying";
                          player.path = null;
                          //player.hp = player.max_hp();
                          //player.mp = player.max_mp();
                          player.delay += Game.player_action_speed;
                          // shop keeper speech
                          var speech = Game.shopkeeperScriptMarkov.make_title(1);
                          Game.ui.shopkeeperSpeech.setString(speech);
                        }
                      }
                    }
                    break;
                  case "sleeping":
                    break;
                  case "waking":
                    // time to wake up
                    player.action = "Waking up";
                    player.state = "route-shop";
                    player.delay = Math.floor(Math.random() * Game.player_action_speed * 5);
                    break;
                  case "adventuring":
                    if (player.hp <= 0) {
                      // dead!
                      Game.removePlayer(iPlayer);
                      break;
                    }
                    if (Game.levels[player.level - 1] === undefined) {
                      // add a new level to the dungeon!
                      Game.levels[player.level - 1] = new Level(player.level);
                      if (player.level > 1) {
                        // attract a new hero before quests are used
                        if (Game.players.length <= Game.quests) {
                          Game.addPlayer();
                        }
                        // play dragon music
                        cc.audioEngine.playMusic(res.music_holdtheline_ogg, true);
                      }
                    }
                    var level = Game.levels[player.level - 1];
                    player.setVisible(false);
                    // age equipment
                    if (player.primary !== null) {
                      player.primary.age();
                    }
                    if (player.secondary !== null) {
                      player.secondary.age();
                    }
                    if (player.tertiary !== null) {
                      player.tertiary.age();
                    }
                    // see if we need to replace equipment
                    var iItems = player.items.length, item;
                    while (iItems--) {
                      item = player.items[iItems];
                      if (player.is_better(item)) {
                        player.equip(item);
                      }
                    }
                    // fight something
                    if (player.monster === null) {
                      // check if need to go to the shops
                      if (player.done_adventuring()) {
                        player.state = "route-shop";
                        break;
                      }
                      // create a new monster
                      if (level.dragon !== null && level.dragon.hp > 0) {
                        player.monster = level.dragon;
                      } else {
                        player.monster = level.monsters[Math.floor(Math.random() * level.monsters.length)].get_instance();
                      }
                      player.action = "Fighting " + player.monster.name;
                    } else {
                      if (player.monster.hp <= 0) {
                        if (player.monster == level.dragon) {
                          // killed the dragon!
                          Game.addLog(player.name + " killed the " + player.monster.name + "!");
                          Game.playMusic();
                          if (level.level == 10) {
                            Game.addLog("You won the game!");
                            Game.wonGame();
                          } else {
                            if (Game.quests > 0) {
                              Game.addLog(player.name + " has completed a quest!");
                              player.gold += Game.quest_wholesale;
                              Game.quests--;
                            }
                          }
                        }
                        // killed it
                        player.xp += player.monster.level + 1;
                        if (player.items.length < player.max_items && Math.floor(Math.random() * Game.item_chance) == 0) {
                          // item
                          var choices = ['armor','armor','light_weapon','light_weapon','light_weapon','heavy_weapon','wand','jewelry'];
                          var type = choices[Math.floor(Math.random() * choices.length)];
                          //var item = null;
                          var item = new Item(Math.ceil(Math.random() * (player.monster.level + 1)), type);
                          if (player.is_better(item)) {
                            player.equip(item);
                            player.action = "Killed " + player.monster.name + ", got " + item.get_name() + ", and equipped it";
                          } else {
                            player.items.push(item);
                            player.action = "Killed " + player.monster.name + ", got " + item.get_name();
                          }
                        } else {
                          // gold
                          var gold = Math.floor(Math.random() * (player.monster.level + 1) * 2);
                          if (gold > 0) {
                            player.action = "Killed " + player.monster.name + ", got " + gold + " gold";
                          } else {
                            player.action = "Killed " + player.monster.name;
                          }
                          player.gold += gold;
                        }
                        player.monster = null;
                      } else {
                        if (player.monster.cast_delay <= 0 && player.mp >= player.cast_cost() && Math.random() * player.get_intelligence() >= Math.random() * player.monster.intelligence) {
                          // cast a spell
                          var dmg = player.cast_damage();
                          player.monster.hp -= dmg;
                          player.action = "Used " + player.spells[Math.floor(Math.random() * player.spells.length)] + " on " + player.monster.name + " for " + dmg;
                          player.mp -= player.cast_cost();
                          player.monster.cast_delay = Game.cast_delay;
                        } else {
                          if (player.monster.cast_delay > 0) {
                            player.monster.cast_delay -= Math.ceil(player.get_intelligence() / 10);
                          }
                          // process melee attack
                          if (Math.random() * player.get_dexterity() > Math.random() * player.monster.dexterity) {
                            if (player.done_adventuring()) {
                              // run away!
                              player.action = "Running away from " + player.monster.name;
                              player.monster = null;
                            } else {
                              // player attack
                              var dmg = Math.max(0, Math.floor(Math.random() * (player.get_strength() - player.monster.ac)));
                              player.monster.hp -= dmg;
                              player.action = "Hit " + player.monster.name + " for " + dmg;
                            }
                          } else {
                            // monster attack
                            var dmg = Math.max(0, Math.floor(Math.random() * (player.monster.strength - player.get_ac())));
                            player.hp -= dmg;
                            player.action = player.monster.name + " hit for " + dmg;
                          }
                        }
                      }
                    }
                    player.delay += Game.player_action_speed;
                    break;
                  case "buying":
                    // see if we need to sell anything
                    var transacted = false;
                    if (player.items.length > 0) {
                      var item = player.items.pop();
                      if (Game.gold < item.buy_price() || Math.floor(Math.random() * player.level * (player.items.length + 1) * item.buy_price()) == 0) {
                        if (player.can_use(item) || Math.floor(Math.random() * item.buy_price()) > 0) {
                          // hold onto it
                          player.items.push(item);
                        } else {
                          // throw it away
                          player.action = "Threw away " + item.get_name();
                          transacted = true;
                        }
                      } else {
                        // sell it
                        cc.audioEngine.playEffect(res.sound_handleCoins_ogg);
                        Game.items.push(item);
                        player.gold += item.buy_price();
                        Game.gold -= item.buy_price();
                        player.action = "Sold " + item.get_name();
                        transacted = true;
                      }
                    }

                    if (!transacted) {
                      // buy potions
                      var buyHeal = Math.min(Math.floor(player.max_hp() / (Game.heal_potion_power / 3)) - player.healPotions, Game.healPotions, Math.floor(player.gold / Game.healPotionsPrice));
                      var buyMana = Math.min(Math.floor(player.max_mp() / (Game.mana_potion_power / 3)) - player.manaPotions, Game.manaPotions, Math.floor(player.gold / Game.manaPotionsPrice));
                      // adjust down for price
                      buyHeal = Math.min(Math.floor(Math.random() * player.gold / Game.healPotionsPrice), buyHeal);
                      buyMana = Math.min(Math.floor(Math.random() * player.gold / Game.manaPotionsPrice), buyMana);

                      // if we can't afford everything, whittle it down
                      while (buyHeal * Game.healPotionsPrice + buyMana * Game.manaPotionsPrice > player.gold) {
                        if (player.healPotions == 0 && buyMana > 0) {
                          buyHeal = 1;
                          buyMana = 0;
                        } else if (player.manaPotions == 0 && buyHeal > 0) {
                          buyHeal = 0;
                          buyMana = 1;
                        } else if (buyHeal * Game.healPotionsPrice > buyMana * Game.manaPotionsPrice) {
                          buyHeal--;
                        } else {
                          buyMana--;
                        }
                      }

                      if (buyHeal > 0 || buyMana > 0) {
                        cc.audioEngine.playEffect(res.sound_handleCoins2_ogg);
                        player.action = "Bought ";
                        // heal first
                        if (buyHeal > 0) {
                          player.gold -= buyHeal * Game.healPotionsPrice;
                          player.healPotions += buyHeal;
                          Game.healPotions -= buyHeal;
                          Game.gold += buyHeal * Game.healPotionsPrice;
                          player.action += buyHeal + " healing potions";
                          if (buyMana > 0) {
                            player.action += " and ";
                          }
                        }
                        // then mana
                        if (buyMana > 0) {
                          player.gold -= buyMana * Game.manaPotionsPrice;
                          player.manaPotions += buyMana;
                          Game.manaPotions -= buyMana;
                          Game.gold += buyMana * Game.manaPotionsPrice;
                          player.action += buyMana + " mana potions";
                        }
                        transacted = true;
                      }
                    }

                    if (!transacted) {
                      // see if we can buy anything
                      var iItem = Game.items.length, item, best = null;
                      while (iItem--) {
                        item = Game.items[iItem];
                        if (player.is_better(item) && player.gold >= item.sell_price() && (best === null || item.level > Game.items[best].level)) {
                          // elligible, but let's roll a price check
                          if (Math.random() * player.gold >= item.sell_price()) {
                            best = iItem;
                          }
                        }
                      }
                      if (best !== null) {
                        cc.audioEngine.playEffect(res.sound_handleCoins_ogg);
                        item = Game.items[best];
                        player.gold -= item.sell_price();
                        Game.gold += item.sell_price();
                        Game.items.splice(best, 1);
                        player.equip(item);
                        player.action = "Bought " + item.get_name();
                        transacted = true;
                      }
                    }

                    if (!transacted) {
                      Game.ui.shopkeeperSpeech.setString("");
                      // all done shopping
                      if (Game.hour >= Game.evening_hour || Game.hour < Game.morning_hour) {
                        player.state = "route-bed";
                      } else if (player.done_adventuring()) {
                        // we couldn't get what we needed at the shops
                        player.state = "route-bed";
                      } else {
                        player.state = "route-dungeon";
                      }
                    }
                    player.delay += Game.player_action_speed;
                    break;
                  default:
                    // go to the dungeon I guess
                    player.state = "route-dungeon";
                    break;
                }
              } else {
                player.delay -= Game.getSpeed();
              }
            }
            if (!awake) {
              /*
              if (Game.hour < Game.morning_hour) {
                // skip to morning
                Game.hour = Game.morning_hour;
                Game.minute = 0;
                Game.second = 0;
              } else {
                // all players are asleep, skip to next day
                Game.hour = 23;
                Game.minute = 59;
                Game.second = 59;
              }
              */
              Game.speed = 60;
            }
          },
          init: function() {
            cc.eventManager.addListener({
              event: cc.EventListener.TOUCH_ONE_BY_ONE,
              swallowTouches: true,
              onTouchBegan: this.onTouchBegan,
              onTouchMoved: this.onTouchMoved,
              onTouchEnded: this.onTouchEnded
            }, this);
            cc.eventManager.addListener({
              event: cc.EventListener.MOUSE,
              onMouseMove: this.onMouseMove,
              onMouseUp: this.onMouseUp,
              onMouseDown: this.onMouseDown,
              onMouseScroll: this.onMouseScroll
            }, this);
            cc.eventManager.addListener({
              event: cc.EventListener.KEYBOARD,
              onKeyPressed: this.onKeyPressed,
              onKeyReleased: this.onKeyReleased
            }, this);    
          },
          onKeyPressed: function(keyCode, evt) {
          },
          onKeyReleased: function(keyCode, evt) {
            // space: 32
            // pgup: 33
            // pgdn: 34
            // left: 37
            // up: 38
            // right: 39
            // down: 40
            if (keyCode == 32) {
              // space bar is pause/unpause
              if (Game.pause == 0) {
                Game.pause = 1;
              } else {
                Game.pause = 0;
              }
            } else if (keyCode == 33) {
              // pgup is previous log page
              if (Game.log_page > 0) {
                Game.log_page--;
              }
            } else if (keyCode == 34) {
              // pgdn is next log page
              if (Game.log_page < Math.ceil(Game.log.length / Game.max_log) - 1) {
                Game.log_page++;
              }
            } else if (keyCode == 37) {
              // left is previous hero
              Game.selectPlayer(-1);
            } else if (keyCode == 38) {
              Game.pause = 1;
              // up is speed game
              if (Game.speed < 6) {
                Game.speed++;
              } else if (Game.speed < 20) {
                Game.speed = 20;
              }
            } else if (keyCode == 39) {
              // right is next hero
              Game.selectPlayer(1);
            } else if (keyCode == 40) {
              Game.pause = 1;
              // down is slow game
              if (Game.speed > 1) {
                Game.speed--;
              }
            }
          },
          onTouchEnded: function() {
            //alert('tb');
          },
          onTouchMoved: function() {
            //alert('tm');
          },
          onTouchBegan: function(touch, evt) {
            //alert('te');
            //var target = evt.getCurrentTarget();  
            //var locationInNode = target.convertToNodeSpace(touch.getLocation());  
            //var locationInNode = touch.getLocation();
            //var mx = locationInNode.x;
            //var my = locationInNode.y;
            var mx = touch.getLocationX();
            var my = touch.getLocationY();
            //alert([mx,my]);
            Game.onClick(mx, my);
          },
          onMouseMove: function(evt) {
            /*
            var winsize = cc.director.getWinSize();
            var mx = evt.getLocationX();
            var my = evt.getLocationY();
            if (Game.mdown) {
              Game.mdrag = true;
              Game.offset_x += mx - Game.mx;
              Game.offset_y -= my - Game.my;
            }
            Game.mx = evt.getLocationX();
            Game.my = evt.getLocationY();
            */
            Game.tooltip.setVisible(false);
            var mx = evt.getLocationX();
            var my = evt.getLocationY();
            if (Game.isInBox(Game.ui.heroBox, mx, my) || Game.isInBox(Game.ui.portrait, mx, my)) {
              // display stat sheet
              var player = Game.players[Game.selectedPlayer];
              var tip = player.name + "\n" + player.player_class + " L" + player.level;
              tip += "\nStr: " + player.get_strength() + " (" + player.strength + ")";
              tip += "\nDex: " + player.get_dexterity() + " (" + player.dexterity + ")";
              tip += "\nInt: " + player.get_intelligence() + " (" + player.intelligence + ")";
              tip += "\nAC: " + player.get_ac() + " (" + player.ac + ")";
              tip += "\nHP: " + player.hp + "/" + player.max_hp();
              tip += "\nMP: " + player.mp + "/" + player.max_mp();
              tip += "\nXP: " + player.xp + "/" + player.next_level();
              Game.tooltip.setString(tip);
              Game.tooltip.setPosition(mx, my);
              Game.tooltip.setVisible(true);
              return;
            }
            var buttons = Game.buttonGroup.getObjects(), iButtons = buttons.length, button;
            while (iButtons--) {
              button = buttons[iButtons];
              if (button['tooltip'] !== undefined && Game.isInBox(button, mx, my)) {
                Game.tooltip.setString(button['tooltip']);
                Game.tooltip.setPosition(mx, my);
                Game.tooltip.setVisible(true);
                return;
              }
            }
            var uis = Game.uiGroup.getObjects(), iUis = uis.length, ui;
            while (iUis--) {
              ui = uis[iUis];
              if (ui['tooltip'] !== undefined && Game.isInBox(ui, mx, my)) {
                Game.tooltip.setString(ui['tooltip']);
                Game.tooltip.setPosition(mx, my);
                Game.tooltip.setVisible(true);
                return;
              }
            }
          },
          onMouseUp: function(evt) {
             /*
            Game.mdown = false;
            if (Game.mdrag) {
              Game.mdrag = false;
            } else {
              Game.doClick();
              // kill the mouse position to prevent further clicks
              Game.mx = -1;
              Game.my = -1;
            }
            */
            var mx = evt.getLocationX();
            var my = evt.getLocationY();
            //Game.onClick(mx, my);
          },
          onMouseDown: function() {
            /*
            Game.mdown = true;
            */
          },
          onMouseScroll: function() {
          },
        });
        var startScene = new StartScene();
        cc.director.runScene(startScene);
      }, this);
    };
    cc.game.run(gameCanvas);
  },
  onClick: function(mx, my) {
    if (Game.isInBox(Game.speedPauseButton, mx, my)) {
      if (Game.pause == 0) {
        Game.pause = 1;
      } else {
        Game.pause = 0;
      }
    }
    if (Game.isInBox(Game.speedNormalButton, mx, my)) {
      Game.pause = 1;
      Game.speed = 2;
    }
    if (Game.isInBox(Game.speedFastButton, mx, my)) {
      Game.pause = 1;
      Game.speed = 5;
    }
    if (Game.isInBox(Game.speedFasterButton, mx, my)) {
      Game.pause = 1;
      Game.speed = 20;
    }
    if (Game.isInBox(Game.playerLeftButton, mx, my)) {
      Game.selectPlayer(-1);
    }
    if (Game.playerRightButton['x'] < mx && mx < (Game.playerRightButton['x'] + Game.playerRightButton['width']) && Game.playerRightButton['y'] < my && my < (Game.playerRightButton['y'] + Game.playerRightButton['height'])) {
      //alert('right');
      Game.selectPlayer(1);
    }
    if (Game.logFirstButton['x'] < mx && mx < (Game.logFirstButton['x'] + Game.logFirstButton['width']) && Game.logFirstButton['y'] < my && my < (Game.logFirstButton['y'] + Game.logFirstButton['height'])) {
      Game.log_page = 0;
    }
    if (Game.logPreviousButton['x'] < mx && mx < (Game.logPreviousButton['x'] + Game.logPreviousButton['width']) && Game.logPreviousButton['y'] < my && my < (Game.logPreviousButton['y'] + Game.logPreviousButton['height'])) {
      Game.log_page--;
      if (Game.log_page < 0) {
        Game.log_page = 0;
      }
    }
    if (Game.logNextButton['x'] < mx && mx < (Game.logNextButton['x'] + Game.logNextButton['width']) && Game.logNextButton['y'] < my && my < (Game.logNextButton['y'] + Game.logNextButton['height'])) {
      Game.log_page++;
      if (Game.log_page > Math.ceil(Game.log.length / Game.max_log) - 1) {
        Game.log_page = Math.ceil(Game.log.length / Game.max_log) - 1;
      }
    }
    if (Game.logLastButton['x'] < mx && mx < (Game.logLastButton['x'] + Game.logLastButton['width']) && Game.logLastButton['y'] < my && my < (Game.logLastButton['y'] + Game.logLastButton['height'])) {
      Game.log_page = Math.ceil(Game.log.length / Game.max_log) - 1;
    }
    if (Game.healPotionsPriceUpButton['x'] < mx && mx < (Game.healPotionsPriceUpButton['x'] + Game.healPotionsPriceUpButton['width']) && Game.healPotionsPriceUpButton['y'] < my && my < (Game.healPotionsPriceUpButton['y'] + Game.healPotionsPriceUpButton['height'])) {
      Game.healPotionsPrice++;
    }
    if (Game.healPotionsPriceDownButton['x'] < mx && mx < (Game.healPotionsPriceDownButton['x'] + Game.healPotionsPriceDownButton['width']) && Game.healPotionsPriceDownButton['y'] < my && my < (Game.healPotionsPriceDownButton['y'] + Game.healPotionsPriceDownButton['height'])) {
      Game.healPotionsPrice--;
      if (Game.healPotionsPrice < 0) {
        Game.healPotionsPrice = 0;
      }
    }
    if (Game.manaPotionsPriceUpButton['x'] < mx && mx < (Game.manaPotionsPriceUpButton['x'] + Game.manaPotionsPriceUpButton['width']) && Game.manaPotionsPriceUpButton['y'] < my && my < (Game.manaPotionsPriceUpButton['y'] + Game.manaPotionsPriceUpButton['height'])) {
      Game.manaPotionsPrice++;
    }
    if (Game.manaPotionsPriceDownButton['x'] < mx && mx < (Game.manaPotionsPriceDownButton['x'] + Game.manaPotionsPriceDownButton['width']) && Game.manaPotionsPriceDownButton['y'] < my && my < (Game.manaPotionsPriceDownButton['y'] + Game.manaPotionsPriceDownButton['height'])) {
      Game.manaPotionsPrice--;
      if (Game.manaPotionsPrice < 0) {
        Game.manaPotionsPrice = 0;
      }
    }
    if (Game.itemsPriceUpButton['x'] < mx && mx < (Game.itemsPriceUpButton['x'] + Game.itemsPriceUpButton['width']) && Game.itemsPriceUpButton['y'] < my && my < (Game.itemsPriceUpButton['y'] + Game.itemsPriceUpButton['height'])) {
      Game.itemsPrice++;
    }
    if (Game.itemsPriceDownButton['x'] < mx && mx < (Game.itemsPriceDownButton['x'] + Game.itemsPriceDownButton['width']) && Game.itemsPriceDownButton['y'] < my && my < (Game.itemsPriceDownButton['y'] + Game.itemsPriceDownButton['height'])) {
      Game.itemsPrice--;
      if (Game.itemsPrice < 0) {
        Game.itemsPrice = 0;
      }
    }
    if (Game.armorPriceUpButton['x'] < mx && mx < (Game.armorPriceUpButton['x'] + Game.armorPriceUpButton['width']) && Game.armorPriceUpButton['y'] < my && my < (Game.armorPriceUpButton['y'] + Game.armorPriceUpButton['height'])) {
      Game.buy_price['armor']++;
    }
    if (Game.armorPriceDownButton['x'] < mx && mx < (Game.armorPriceDownButton['x'] + Game.armorPriceDownButton['width']) && Game.armorPriceDownButton['y'] < my && my < (Game.armorPriceDownButton['y'] + Game.armorPriceDownButton['height'])) {
      Game.buy_price['armor']--;
      if (Game.buy_price['armor'] < 0) {
        Game.buy_price['armor'] = 0;
      }
    }
    if (Game.heavyWeaponsPriceUpButton['x'] < mx && mx < (Game.heavyWeaponsPriceUpButton['x'] + Game.heavyWeaponsPriceUpButton['width']) && Game.heavyWeaponsPriceUpButton['y'] < my && my < (Game.heavyWeaponsPriceUpButton['y'] + Game.heavyWeaponsPriceUpButton['height'])) {
      Game.buy_price['heavy_weapon']++;
    }
    if (Game.heavyWeaponsPriceDownButton['x'] < mx && mx < (Game.heavyWeaponsPriceDownButton['x'] + Game.heavyWeaponsPriceDownButton['width']) && Game.heavyWeaponsPriceDownButton['y'] < my && my < (Game.heavyWeaponsPriceDownButton['y'] + Game.heavyWeaponsPriceDownButton['height'])) {
      Game.buy_price['heavy_weapon']--;
      if (Game.buy_price['heavy_weapon'] < 0) {
        Game.buy_price['heavy_weapon'] = 0;
      }
    }
    if (Game.lightWeaponsPriceUpButton['x'] < mx && mx < (Game.lightWeaponsPriceUpButton['x'] + Game.lightWeaponsPriceUpButton['width']) && Game.lightWeaponsPriceUpButton['y'] < my && my < (Game.lightWeaponsPriceUpButton['y'] + Game.lightWeaponsPriceUpButton['height'])) {
      Game.buy_price['light_weapon']++;
    }
    if (Game.lightWeaponsPriceDownButton['x'] < mx && mx < (Game.lightWeaponsPriceDownButton['x'] + Game.lightWeaponsPriceDownButton['width']) && Game.lightWeaponsPriceDownButton['y'] < my && my < (Game.lightWeaponsPriceDownButton['y'] + Game.lightWeaponsPriceDownButton['height'])) {
      Game.buy_price['light_weapon']--;
      if (Game.buy_price['light_weapon'] < 0) {
        Game.buy_price['light_weapon'] = 0;
      }
    }
    if (Game.wandsPriceUpButton['x'] < mx && mx < (Game.wandsPriceUpButton['x'] + Game.wandsPriceUpButton['width']) && Game.wandsPriceUpButton['y'] < my && my < (Game.wandsPriceUpButton['y'] + Game.wandsPriceUpButton['height'])) {
      Game.buy_price['wand']++;
    }
    if (Game.wandsPriceDownButton['x'] < mx && mx < (Game.wandsPriceDownButton['x'] + Game.wandsPriceDownButton['width']) && Game.wandsPriceDownButton['y'] < my && my < (Game.wandsPriceDownButton['y'] + Game.wandsPriceDownButton['height'])) {
      Game.buy_price['wand']--;
      if (Game.buy_price['wand'] < 0) {
        Game.buy_price['wand'] = 0;
      }
    }
    if (Game.jewelryPriceUpButton['x'] < mx && mx < (Game.jewelryPriceUpButton['x'] + Game.jewelryPriceUpButton['width']) && Game.jewelryPriceUpButton['y'] < my && my < (Game.jewelryPriceUpButton['y'] + Game.jewelryPriceUpButton['height'])) {
      Game.buy_price['jewelry']++;
    }
    if (Game.jewelryPriceDownButton['x'] < mx && mx < (Game.jewelryPriceDownButton['x'] + Game.jewelryPriceDownButton['width']) && Game.jewelryPriceDownButton['y'] < my && my < (Game.jewelryPriceDownButton['y'] + Game.jewelryPriceDownButton['height'])) {
      Game.buy_price['jewelry']--;
      if (Game.buy_price['jewelry'] < 0) {
        Game.buy_price['jewelry'] = 0;
      }
    }
    Game.updateUI();
  },
  isInBox: function(box, mx, my) {
    return box['x'] < mx && mx < (box['x'] + box['width']) && box['y'] < my && my < (box['y'] + box['height']);
  },
  updateDialogButtons: function() {
    Game.ui.buyHealPotionsButton.setEnabled(Game.gold >= Game.potion_wholesale);
    Game.ui.buyManaPotionsButton.setEnabled(Game.gold >= Game.potion_wholesale);
    Game.ui.buyTenHealPotionsButton.setEnabled(Game.gold >= Game.potion_wholesale * 10);
    Game.ui.buyTenManaPotionsButton.setEnabled(Game.gold >= Game.potion_wholesale * 10);
    Game.ui.buyQuestsButton.setEnabled(Game.gold >= Game.quest_wholesale);
  },
  buyHealPotions: function(qty) {
    Game.healPotions += qty;
    Game.gold -= qty * Game.potion_wholesale;
    Game.updateDialogButtons();
    Game.updateUI();
  },
  buyManaPotions: function(qty) {
    Game.manaPotions += qty;
    Game.gold -= qty * Game.potion_wholesale;
    Game.updateDialogButtons();
    Game.updateUI();
  },
  buyQuest: function() {
    Game.quests += 1;
    Game.gold -= Game.quest_wholesale;
    //Game.quest_wholesale += 10;
    Game.updateDialogButtons();
    Game.updateUI();
  },
  dialogContinue: function() {
    Game.showDialog = false;
    Game.dialog.setVisible(false);
    Game.dialogText.setVisible(false);
    Game.dialogMenu.setVisible(false);
    /*
    // jump to the morning
    Game.hour = Game.morning_hour;
    Game.minute = 0;
    Game.second = 0;
    */
  },
  getSpeed: function() {
    return Game.speed * Game.pause;
  },
  playMusic: function() {
    var musics = [res.music_heroimmortal_ogg, res.music_ajourneyawaits_ogg];
    //var musics = [res.music_heroimmortal_ogg, res.music_airship_ogg, res.music_ajourneyawaits_ogg];
    cc.audioEngine.playMusic(choice(musics), true);
  },
  addLabel: function(boxName, text, fontSize, zIndex, font) {
    if (font === undefined) {
      font = res.diablo_heavy_ttf;
    }
    var box = Game.uiGroup.getObject(boxName);
    //var label = cc.LabelTTF.create(text, "Papyrus", fontSize);
    //label.setPosition(box["x"] + (label.getContentSize().width / 2), box["y"] + box["height"] - (label.getContentSize().height / 2));
    if (box === null) alert(boxName);
    var label = cc.LabelTTF.create(text, font, fontSize, cc.size(box["width"], box["height"]), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    //label.setPosition(box["x"], box["y"]);
    label.setPosition(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2);
    label.fillStyle = new cc.Color(0, 0, 0, 0);
    if (zIndex !== undefined) {
      label.zIndex = zIndex;
    }
    Game.scene.addChild(label, 1);
    return label;
  },
  initGame: function() {
    Game.gold = 100;
    Game.items = [];
    Game.players = [];
    Game.levels = [];
    Game.healPotions = 0;
    Game.manaPotions = 0;
    Game.quests = 0;
    Game.day = 1;
    Game.hour = 0;
    Game.minute = 0;
    Game.second = 0;
  },
  initUI: function() {
    Game.ui.portrait = Game.uiGroup.getObject("Portrait");
    Game.ui.heroBox = Game.uiGroup.getObject("HeroName");

    Game.ui.logo = Game.addLabel("Logo", "Tristram", 40);
    Game.ui.logo.fillStyle = new cc.Color(195, 0, 0);
    Game.ui.logo.enableStroke(new cc.Color(25, 25, 5), 4);
    Game.ui.gold = Game.addLabel("Gold", "", 24);
    Game.ui.heroName = Game.addLabel("HeroName", "", 24);
    Game.ui.heroStats = Game.addLabel("HeroStats", "", 14);
    Game.ui.heroHP = Game.addLabel("HeroHP", "", 14);
    Game.ui.heroMP = Game.addLabel("HeroMP", "", 14);
    Game.ui.heroStatus = Game.addLabel("HeroStatus", "", 12);
    Game.ui.armorPrice = Game.addLabel("ArmorPrice", "", 14);
    Game.ui.armorBox = Game.addLabel("ArmorBox", "", 14);
    Game.ui.armorLeatherBox = Game.addLabel("ArmorLeatherBox", "", 14);
    Game.ui.armorStuddedBox = Game.addLabel("ArmorStuddedBox", "", 14);
    Game.ui.armorChainmailBox = Game.addLabel("ArmorChainmailBox", "", 14);
    Game.ui.armorScaleBox = Game.addLabel("ArmorScaleBox", "", 14);
    Game.ui.armorPlateBox = Game.addLabel("ArmorPlateBox", "", 14);
    Game.ui.heavyWeaponsPrice = Game.addLabel("HeavyWeaponsPrice", "", 14);
    Game.ui.heavyWeaponsBox = Game.addLabel("HeavyWeaponsBox", "", 14);
    Game.ui.heavyWeaponsCrudeBox = Game.addLabel("HeavyWeaponsCrudeBox", "", 14);
    Game.ui.heavyWeaponsGoodBox = Game.addLabel("HeavyWeaponsGoodBox", "", 14);
    Game.ui.heavyWeaponsIronBox = Game.addLabel("HeavyWeaponsIronBox", "", 14);
    Game.ui.heavyWeaponsSteelBox = Game.addLabel("HeavyWeaponsSteelBox", "", 14);
    Game.ui.heavyWeaponsMithrilBox = Game.addLabel("HeavyWeaponsMithrilBox", "", 14);
    Game.ui.lightWeaponsPrice = Game.addLabel("LightWeaponsPrice", "", 14);
    Game.ui.lightWeaponsBox = Game.addLabel("LightWeaponsBox", "", 14);
    Game.ui.lightWeaponsWoodenBox = Game.addLabel("LightWeaponsWoodenBox", "", 14);
    Game.ui.lightWeaponsBronzeBox = Game.addLabel("LightWeaponsBronzeBox", "", 14);
    Game.ui.lightWeaponsIronBox = Game.addLabel("LightWeaponsIronBox", "", 14);
    Game.ui.lightWeaponsSteelBox = Game.addLabel("LightWeaponsSteelBox", "", 14);
    Game.ui.lightWeaponsMithrilBox = Game.addLabel("LightWeaponsMithrilBox", "", 14);
    Game.ui.wandsPrice = Game.addLabel("WandsPrice", "", 14);
    Game.ui.wandsBox = Game.addLabel("WandsBox", "", 14);
    Game.ui.wandsGarnetBox = Game.addLabel("WandsGarnetBox", "", 14);
    Game.ui.wandsSapphireBox = Game.addLabel("WandsSapphireBox", "", 14);
    Game.ui.wandsRubyBox = Game.addLabel("WandsRubyBox", "", 14);
    Game.ui.wandsEmeraldBox = Game.addLabel("WandsEmeraldBox", "", 14);
    Game.ui.jewelryPrice = Game.addLabel("JewelryPrice", "", 14);
    Game.ui.jewelryBox = Game.addLabel("JewelryBox", "", 14);
    Game.ui.jewelryAmethystBox = Game.addLabel("JewelryAmethystBox", "", 14);
    Game.ui.jewelrySapphireBox = Game.addLabel("JewelrySapphireBox", "", 14);
    Game.ui.jewelryRubyBox = Game.addLabel("JewelryRubyBox", "", 14);
    Game.ui.jewelryDiamondBox = Game.addLabel("JewelryDiamondBox", "", 14);
    Game.ui.shopQuests = Game.addLabel("ShopQuests", "", 14);
    Game.ui.heroHealPotions = Game.addLabel("HeroHealPotions", "0", 14);
    Game.ui.heroManaPotions = Game.addLabel("HeroManaPotions", "0", 14);
    Game.ui.shopHealPotions = Game.addLabel("ShopHealPotions", "0", 14);
    Game.ui.shopManaPotions = Game.addLabel("ShopManaPotions", "0", 14);
    Game.ui.heroGold = Game.addLabel("HeroGold", "0", 14);
    Game.ui.heroItems = Game.addLabel("HeroItems", "0", 14);
    Game.ui.shopGold = Game.addLabel("ShopGold", "0", 14);
    Game.ui.logBox = Game.addLabel("LogBox", "", 12);
    Game.ui.manaPotionsPrice = Game.addLabel("ManaPotionsPrice", "0", 14);
    Game.ui.healPotionsPrice = Game.addLabel("HealPotionsPrice", "0", 14);
    Game.ui.itemsPrice = Game.addLabel("ItemsPrice", "0", 14);
    // shopkeeper speech
    var shopkeeperSpeechBox = Game.objectGroup.getObject("ShopkeeperSpeech");
    Game.ui.shopkeeperSpeech = cc.LabelTTF.create("", res.diablo_heavy_ttf, 12);
    Game.ui.shopkeeperSpeech = cc.LabelTTF.create("", res.diablo_heavy_ttf, 12, cc.size(shopkeeperSpeechBox["width"], shopkeeperSpeechBox["height"]), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
    Game.ui.shopkeeperSpeech.fillStyle = new cc.Color(255, 255, 155);
    Game.ui.shopkeeperSpeech.enableStroke(new cc.Color(25, 25, 5), 2);
    Game.ui.shopkeeperSpeech.setPosition(shopkeeperSpeechBox["x"] + shopkeeperSpeechBox["width"] / 2, shopkeeperSpeechBox["y"] + shopkeeperSpeechBox["height"] / 2);
    Game.scene.addChild(Game.ui.shopkeeperSpeech);
    // tooltip
    Game.tooltip = cc.LabelTTF.create("", res.diablo_heavy_ttf, 12);
    Game.tooltip.fillStyle = new cc.Color(255, 0, 0);
    Game.tooltip.setVisible(false);
    Game.tooltip.setAnchorPoint(1, 1);
    Game.tooltip.enableStroke(new cc.Color(25, 25, 5), 2);
    Game.scene.addChild(Game.tooltip, 1);
  },
  updateUI: function() {
    if (Game.players.length == 0) {
      Game.ui.heroName.setString("");
      Game.ui.heroGold.setString("");
      Game.ui.heroItems.setString("");
      Game.ui.heroHealPotions.setString("");
      Game.ui.heroManaPotions.setString("");
      Game.ui.heroHP.setString("");
      Game.ui.heroMP.setString("");
      Game.ui.heroStats.setString("");
      Game.ui.heroStatus.setString("");
    } else {
      var player = Game.players[Game.selectedPlayer];
      Game.ui.heroName.setString(player.name + " [" + player.player_class.substring(0, 1) + "-" + player.level + "]");
      Game.ui.heroGold.setString(player.gold);
      Game.ui.heroItems.setString(player.items.length);
      Game.ui.heroHealPotions.setString(player.healPotions);
      Game.ui.heroManaPotions.setString(player.manaPotions);
      var equipment = [];
      if (player.primary !== null) {
        equipment.push(player.primary.get_name());
      } else {
        equipment.push("Fists");
      }
      if (player.secondary !== null) {
        equipment.push(player.secondary.get_name());
      } else {
        equipment.push("Rags");
      }
      if (player.tertiary !== null) {
        equipment.push(player.tertiary.get_name());
      }
      Game.ui.heroHP.setString(player.hp);
      Game.ui.heroMP.setString(player.mp);
      Game.ui.heroStats.setString(equipment.join(', '));
      Game.ui.heroStatus.setString(player.action);
    }
    var shop = [], iItem = Game.items.length, item;
    shop["armor"] = 0;
    shop["armor-leather"] = 0;
    shop["armor-studded"] = 0;
    shop["armor-chainmail"] = 0;
    shop["armor-scale"] = 0;
    shop["armor-plate"] = 0;
    shop["heavy_weapon"] = 0;
    shop["heavy_weapon-crude"] = 0;
    shop["heavy_weapon-good"] = 0;
    shop["heavy_weapon-iron"] = 0;
    shop["heavy_weapon-steel"] = 0;
    shop["heavy_weapon-mithril"] = 0;
    shop["light_weapon"] = 0;
    shop["light_weapon-wooden"] = 0;
    shop["light_weapon-bronze"] = 0;
    shop["light_weapon-iron"] = 0;
    shop["light_weapon-steel"] = 0;
    shop["light_weapon-mithril"] = 0;
    shop["wand"] = 0;
    shop["wand-garnet"] = 0;
    shop["wand-sapphire"] = 0;
    shop["wand-ruby"] = 0;
    shop["wand-emerald"] = 0;
    shop["jewelry"] = 0;
    shop["jewelry-amethyst"] = 0;
    shop["jewelry-sapphire"] = 0;
    shop["jewelry-ruby"] = 0;
    shop["jewelry-diamond"] = 0;
    while (iItem--) {
      item = Game.items[iItem];
      //shop.push(item.get_name());
      shop[item.type]++;
      shop[item.type + "-" + item.material]++;
    }
    for (var key in shop) {
      if (shop[key] == 0) {
        shop[key] = "";
      }
    }
    //Game.ui.shopBox.setString(shop.join(', '));
    Game.ui.armorBox.setString("Armor: " + shop["armor"]);
    Game.ui.armorLeatherBox.setString(shop["armor-leather"]);
    Game.ui.armorStuddedBox.setString(shop["armor-studded"]);
    Game.ui.armorChainmailBox.setString(shop["armor-chainmail"]);
    Game.ui.armorScaleBox.setString(shop["armor-scale"]);
    Game.ui.armorPlateBox.setString(shop["armor-plate"]);
    Game.ui.heavyWeaponsBox.setString("Heavy Weapons: " + shop["heavy_weapon"]);
    Game.ui.heavyWeaponsCrudeBox.setString(shop["heavy_weapon-crude"]);
    Game.ui.heavyWeaponsGoodBox.setString(shop["heavy_weapon-good"]);
    Game.ui.heavyWeaponsIronBox.setString(shop["heavy_weapon-iron"]);
    Game.ui.heavyWeaponsSteelBox.setString(shop["heavy_weapon-steel"]);
    Game.ui.heavyWeaponsMithrilBox.setString(shop["heavy_weapon-mithril"]);
    Game.ui.lightWeaponsBox.setString("Light Weapons: " + shop["light_weapon"]);
    Game.ui.lightWeaponsWoodenBox.setString(shop["light_weapon-wooden"]);
    Game.ui.lightWeaponsBronzeBox.setString(shop["light_weapon-bronze"]);
    Game.ui.lightWeaponsIronBox.setString(shop["light_weapon-iron"]);
    Game.ui.lightWeaponsSteelBox.setString(shop["light_weapon-steel"]);
    Game.ui.lightWeaponsMithrilBox.setString(shop["light_weapon-mithril"]);
    Game.ui.wandsBox.setString("Wands: " + shop["wand"]);
    Game.ui.wandsGarnetBox.setString(shop["wand-garnet"]);
    Game.ui.wandsSapphireBox.setString(shop["wand-sapphire"]);
    Game.ui.wandsRubyBox.setString(shop["wand-ruby"]);
    Game.ui.wandsEmeraldBox.setString(shop["wand-emerald"]);
    Game.ui.jewelryBox.setString("Jewelry: " + shop["jewelry"]);
    Game.ui.jewelryAmethystBox.setString(shop["jewelry-amethyst"]);
    Game.ui.jewelrySapphireBox.setString(shop["jewelry-sapphire"]);
    Game.ui.jewelryRubyBox.setString(shop["jewelry-ruby"]);
    Game.ui.jewelryDiamondBox.setString(shop["jewelry-diamond"]);
    Game.ui.shopQuests.setString(Game.quests);
    Game.ui.gold.setString("Time: " + Game.hour + ":" + (Game.minute < 10 ? "0" : "") + Game.minute + "\nDay: " + Game.day);
    Game.ui.shopGold.setString(Game.gold);
    Game.ui.shopHealPotions.setString(Game.healPotions);
    Game.ui.shopManaPotions.setString(Game.manaPotions);
    Game.ui.healPotionsPrice.setString(Game.healPotionsPrice);
    Game.ui.manaPotionsPrice.setString(Game.manaPotionsPrice);
    Game.ui.itemsPrice.setString(Game.itemsPrice);
    Game.ui.armorPrice.setString(Game.buy_price['armor']);
    Game.ui.heavyWeaponsPrice.setString(Game.buy_price['heavy_weapon']);
    Game.ui.lightWeaponsPrice.setString(Game.buy_price['light_weapon']);
    Game.ui.wandsPrice.setString(Game.buy_price['wand']);
    Game.ui.jewelryPrice.setString(Game.buy_price['jewelry']);
    Game.ui.logBox.setString(Game.log.slice(Game.log_page * Game.max_log, (Game.log_page * Game.max_log) + Game.max_log).join("\n"));
  },
  addLog: function(message) {
    Game.log.push(message);
    if (Game.log.length % Game.max_log == 1 && Game.log_page == Math.floor(Game.log.length / Game.max_log) - 1) {
      Game.log_page += 1;
    }
  },
  canMove: function(x, y) {
    if (Game.canWalk(x, y)) {
      // we can walk, but check for other players
      var iPlayer = Game.players.length, player;
      while (iPlayer--) {
        player = Game.players[iPlayer];
        if (player.visible && player.x == x && player.y == y) {
          // space is occupied
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  },
  canWalk: function(x, y) {
    if (x === null || y === null || x < 0 || y < 0) {
      return false;
    }
    var tileGid = Game.meta.getTileGIDAt(x, Game.map.getMapSize().height - y - 1);
    if (tileGid) {
      var props = Game.map.getPropertiesForGID(tileGid);
      if (props) {
        var coll = props["Collidable"];
        if (coll == "True") {
          return false;
        }
      }
    }
    return true;
  },
  movePlayer: function(player) {
    if (player.path !== null) {
      playerPos = player.path.shift();
      if (playerPos !== null) {
        player.delay += Game.player_walk_speed;
        if (!Game.setPlayerPosition(player, playerPos)) {
          player.path = null;
          player.move_tries += 10;
          if (player.move_tries > 100) {
            // player is stuck, make him invisible so others can pass
            player.setVisible(false);
            player.move_tries = 0;
          }
          return false;
        }
        if (player.move_tries > 0) {
          player.move_tries--;
        }
        return true;
      }
    }
    return false;
  },
  setPlayerPosition: function(player, pos) {
    if (Game.canMove(pos.x, pos.y)) {
      player.move_tries = 0;
      player.setVisible(true);
      player.setPosition(pos.x, pos.y);
      return true;
    } else {
      return false;
    }
  },
  getCoordinateFor: function(pos) {
    var x = pos.x / Game.map.getTileSize().width;
    var y = ((Game.map.getMapSize().height * Game.map.getTileSize().height) - pos.y) / Game.map.getTileSize().height;
    if (x >= 0 && y >= 0 && x < Game.map.getMapSize().width && y < Game.map.getMapSize().height) {
      return {x: Math.floor(x), y: Math.floor(y)}
    } else {
      return false;
    }
  },
  getManhattanDistance: function(fx, fy, tx, ty) {
    return Math.abs(fx - tx) + Math.abs(fy - ty);
  },
  getDistance: function(fx, fy, tx, ty) {
    // from is the final destination square
    // to is the square being checked
    // start with manhattan
    var dist = Game.getManhattanDistance(fx, fy, tx, ty);
    // then identify if this space is occupied
    var iPlayer = Game.players.length, player;
    while (iPlayer--) {
      player = Game.players[iPlayer];
      if (player.visible && player.x == tx && player.y == ty) {
        // space is occupied, double the distance rating
        // this makes occupancy matter more for squares far from the goal
        // (so theoretically closer to the start)
        dist *= 2;
        break;
      }
    }
    return dist;
  },
  findNeighbors: function(x, y) {
    result = [];
    if (y > 0 && Game.canWalk(x, y-1)) {
      result.push({x:x, y:y-1});
    }
    if (Game.canWalk(x, y+1)) {
      result.push({x:x, y:y+1});
    }
    if (x > 0 && Game.canWalk(x-1, y)) {
      result.push({x:x-1, y:y});
    }
    if (Game.canWalk(x+1, y)) {
      result.push({x:x+1, y:y});
    }
    return result;
  },
  selectPlayer: function(selection) {
    Game.selectedPlayer += selection;
    if (Game.selectedPlayer < 0) {
      Game.selectedPlayer = Game.players.length - 1;
    }
    if (Game.selectedPlayer >= Game.players.length) {
      Game.selectedPlayer = 0;
    }
    var iPlayer = Game.players.length, player, iSprite;
    while (iPlayer--) {
      player = Game.players[iPlayer];
      iSprite = player.portraits.length;
      while (iSprite--) {
        if (Game.selectedPlayer == iPlayer) {
          player.portraits[iSprite].setVisible(true);
          //player.sprites[iSprite].setColor(new cc.Color(150,150,255));
        } else {
          player.portraits[iSprite].setVisible(false);
          //player.sprites[iSprite].setColor(new cc.Color(255,255,255));
        }
      }
    }
  },
  addPlayer: function(reason) {
    cc.audioEngine.playEffect(res.sound_knifeSlice2_ogg);
    var spawnPoint = Game.objectGroup.getObject("SpawnPoint");
    var x = spawnPoint["x"];
    var y = spawnPoint["y"];

    var player = new Player();
    player.gold = 10;
    player.setPosition(Math.floor(x / Game.map.getTileSize().width), Math.floor(y / Game.map.getTileSize().height));
    player.state = "route-shop";
    for (var iSprite = 0; iSprite < player.sprites.length; iSprite++) {
      Game.scene.addChild(player.sprites[iSprite], 0);
      Game.scene.addChild(player.portraits[iSprite], 0);
    }
    Game.players.push(player);
    if (reason === undefined) {
      reason = ".";
    } else {
      reason = " " + reason;
    }
    Game.addLog(player.name + " the " + player.player_class + " has arrived" + reason);
  },
  removePlayer: function(iPlayer, reason) {
    player = Game.players[iPlayer];
    for (var iSprite = 0; iSprite < player.sprites.length; iSprite++) {
      Game.scene.removeChild(player.sprites[iSprite]);
      Game.scene.removeChild(player.portraits[iSprite]);
    }
    Game.players.splice(iPlayer, 1);
    if (Game.selectedPlayer > iPlayer) {
      Game.selectPlayer(-1);
    } else if (Game.selectedPlayer == iPlayer) {
      Game.selectPlayer(0);
    }
    if (reason === undefined) {
      if (player.monster === null) {
        Game.addLog(player.name + " has left.");
      } else {
        Game.addLog(player.name + " was killed by " + player.monster.name + ".");
        cc.audioEngine.playEffect(res.sound_wilhelm_ogg);
      }
    } else {
      Game.addLog(player.name + " has left " + reason);
    }
  }
};
function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function romanize (num) {
  if (!+num)
    return false;
  var digits = String(+num).split(""),
    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
           "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
           "","I","II","III","IV","V","VI","VII","VIII","IX"],
    roman = "",
    i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

function deromanize (str) {
  var str = str.toUpperCase(),
    validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
    token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
    key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
    num = 0, m;
  if (!(str && validator.test(str)))
    return false;
  while (m = token.exec(str))
    num += key[m[0]];
  return num;
}
