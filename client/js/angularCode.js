var myApp = angular.module('myApp', ['ngRoute']);

myApp.factory('MonsterFactory', function($http){
	var factory = {};
	factory.monster;
	factory.user;
	factory.logs = [];
	factory.getAvatar = function(callback){
		$http.get('/avatar').success(function(json){
			factory.user = json;
			callback(json);
		})
	}
	factory.getMonster = function(name, callback){
		$http.get('/monster/' + name).success(function(json){
			factory.monster = json;
			callback(json);
		})
	}
	factory.createLog = function(string, callback){
		factory.logs.push(string);
		callback(factory.logs);
	}
	return factory;
})

myApp.controller('MonstersController', function(MonsterFactory, $scope){
	var self = this;
	var string;
	this.user;
	this.monster;
	this.logs = [];
	this.upgrades =[];
	this.isEnabled = true;
	this.monsters = ['Jelly Fish', 'Sea Monster', 'Lava Monster', 'Earth Monster', 'Shadow Monster', 'Sea Snake', 'Food Monster', 'Fire Snake', 'Jungle Monster', 'King of Monsters'];
	MonsterFactory.getAvatar(function(json){
		self.user = json;
	})
	MonsterFactory.getMonster('Jelly Fish', function(json){
		self.monster = json;
	})
	this.attack = function(input){
		if(input.name == 'potion'){
			self.usePotion(input);
			self.monsterAttack();
		}
		else if(input.name == 'pet water snake'){
			self.usePetWaterSnake(input);
		}
		else if(input.name == 'food monster baby'){
			self.useFoodBaby(input);
		} else {
			self.avatarAttack(input);
			if(input.name == 'fire staff'){
				self.removeAbility('fire staff');
			}
			if(self.monster.hitPoints < 1){
				self.monsterDefeated();
			} else {
				$('#monster').effect('shake', function(){
					self.monsterAttack();
					$scope.$apply();
				});
			}
		}
	}
	this.usePetWaterSnake = function(input){
		if(self.monster.name == 'Fire Snake'){
			string = 'You have discovered the ' + self.monster.name + "'s weakness and he is easily defeated.";
			self.createLog(string);
			self.removeAbility(input.name)
			self.monster.hitPoints = 0;
			self.monsterDefeated();
		} else {
			string = "The " + input.name + " has no effect.";
			self.createLog(string);
			self.monsterAttack(self);
		}
	}
	this.useFoodBaby = function(input){
		if(self.monster.name == 'King of Monsters'){
			string = 'You have discovered the ' + self.monster.name + "' weakness and he is easily defeated."
			self.createLog(string);
			self.removeAbility(input.name)
			self.monster.hitPoints = 0;
			self.monsterDefeated();
		} else {
			string = "The " + input.name + " has no effect.";
			self.createLog(string);
			self.monsterAttack();
		}
	}
	this.usePotion = function(input){
		$('#player_health').effect('highlight');
		self.user.hitPoints += input.damage;
		if(self.user.hitPoints > self.user.maxHitPoints){
			self.user.hitPoints = self.user.maxHitPoints;
		}
		string = 'You used your ' + input.name + ' increasing your health to ' + self.user.hitPoints + '.';
		self.removeAbility('potion');
		self.createLog(string);
	}
	this.removeAbility = function(abilityName){
		pos = self.user.abilities.map(function(e) { return e.name; }).indexOf(abilityName);
		self.user.abilities.splice(pos, 1);
	}
	this.createLog = function(string){
		self.logs.push(string);
	}
	this.avatarAttack = function(input){
			self.monster.hitPoints -= input.damage;
			string = 'You used your ' + input.name + ' on the ' + self.monster.name + ' for ' + input.damage + ' damage.';
			self.createLog(string);
	}
	this.avatarDefeated = function(){
		self.isEnabled = false;
		$('#player').effect('pulsate', 500);
		self.user.hitPoints = 0;
		string = "Avatar, you have been defeated.  Please, refresh the page to try again!";
		self.createLog(string);
	}
	this.monsterAttack = function(){
		$('#player').effect('shake');
		string = self.monster.name + " uses " + self.monster.abilities[0].name + " on you for " + self.monster.abilities[0].damage + " damage.";
		self.createLog(string);
		self.user.hitPoints -= self.monster.abilities[0].damage;
		if(self.user.hitPoints < 1){
			self.avatarDefeated();
		}
	}
	this.monsterDefeated = function(){
		self.monster.hitPoints = 0;
		$('#monster').effect('pulsate', 500);
		string = "Congratulations Avatar, you have defeated the " + self.monster.name + "!";
		self.createLog(string);
		if(self.monster.name == 'King of Monsters'){
			self.gameWon();
		} else {
			$('#monster').fadeOut(function(){
				for(var i = 0; i < self.monsters.length; i++){
					if(self.monsters[i] == self.monster.name){
						MonsterFactory.getMonster(self.monsters[i + 1], function(json){
							self.monster = json;
						})
						break;
					} 
				}
			});
			this.upgradePaths();
		}
	}
	this.upgradePaths = function(){
		self.isEnabled = false;
		string = 'Please, select one of the following upgrades:'
		self.createLog(string);
		if(self.monster.name == 'Jelly Fish'){
			self.upgrades = ['sword damage + 4', 'receive 1 potion'];
		}
		else if(self.monster.name == 'Sea Monster'){
			self.upgrades = ['sword damage + 6', 'max health + 15'];
		}
		else if(self.monster.name == 'Lava Monster'){
			self.upgrades = ['max health + 20', 'receive 1 potion'];
		}
		else if(self.monster.name == 'Earth Monster'){
			self.upgrades = ['receive 1 fire staff', 'receive 1 potion']
		}
		else if(self.monster.name == 'Shadow Monster'){
			self.upgrades = ['max health + 30', 'sword damage + 8'];
		}
		else if(self.monster.name == 'Sea Snake'){
			self.upgrades = ['receive 1 pet water snake', 'max health + 30'];
		}
		else if(self.monster.name == 'Food Monster'){
			self.upgrades = ['sword damage + 10', 'receive 1 food monster baby'];
		}
		else if(self.monster.name == 'Fire Snake'){
			self.upgrades = ['receive 2 potions', 'sword damage + 10'];
		}
		else if(self.monster.name == 'Jungle Monster'){
			self.upgrades = ['sword damage + 10', 'max health + 30'];
		}
		$('#upgrades').fadeIn();
	}
	this.upgrade = function(string){
		if(string.indexOf('sword damage') != -1){
			$('#ability_table tr:nth-child(2)').effect('highlight');
			string = string.split(' ');
			self.user.abilities[0].damage += parseInt(string[string.length - 1]);
		}
		else if(string.indexOf('potion') != -1){
			string = string.split(' ');
			for(var i = 0; i < string[1]; i++){
				self.user.abilities.push({name: 'potion', damage: 20, effect: 'health'});
			}
		}
		else if(string.indexOf('max health') != -1){
			$('#player_health').effect('highlight');
			string = string.split(' ');
			var modifier = parseInt(string[string.length - 1]);
			self.user.maxHitPoints += modifier;
			self.user.hitPoints += modifier;
		}
		else if (string == 'receive 1 fire staff'){
			self.user.abilities.push({name: 'fire staff', damage: 25, effect: 'damage'});
		}
		else if(string == 'receive 1 pet water snake'){
			self.user.abilities.push({name: 'pet water snake', damage: '', effect: 'unknown'});
		}
		else if(string == 'receive 1 food monster baby'){
			self.user.abilities.push({name: 'food monster baby', damage: '', effect: 'unknown'});
		}
		self.logs = [];
		MonsterFactory.logs = [];
		self.upgrades = [];
		$('#upgrades').hide();
		$('#monster').fadeIn();
		self.isEnabled = true;
	}
	this.gameWon = function(){
		self.isEnabled = false;
		$('#monster').fadeOut();
		string = "The Realm is safe thanks to you, Avatar.";
		self.createLog(string);
		string = "If you would like to play again, please refresh the page."
		self.createLog(string);
	}
})