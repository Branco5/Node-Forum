create database node_db;

use node_db;

create table users(
	id int auto_increment primary key,
    username varchar(50) not null unique,
    pass varchar(50) not null,
    usertype varchar(20) not null,    
    registerDate varchar(50)
);

insert into users(username, pass, usertype) values ("admin", "admin", "admin"),
													("manager1", "manager1", "contentManager");
                                                    
create table categories(
	name varchar(100) unique not null,
    userid int references users(id),
    createDate varchar(50)
);

insert into categories(name, userid, createDate) values('Strategy', 1, "30-1-2022 18:30:33");

create table posts(
	id int auto_increment primary key,
    category varchar(100) not null,
	game varchar(100) not null,
    body varchar(5000) not null,
    userid int not null references users(id),
    postDate varchar(50),
    imgUrl varchar(1000)
);

insert into posts(category, game, body, userid, postDate, imgUrl) 
	       values ('strategy', 'Medieval 2 Total War', 'Probably the best game of the whole series. When this game was released, Sega didnt sell the game like a puzzle like they do nowadays, with the most recent titles of this franchise. You can appreciate a fully finished game, with massive battles, city assaults, crusades and where you face your enemies, treason and the pest. It trully replicates the unstable atmosphere of the medieval world. Dont trust nobody, your allies are one day away from being your enemies, and your enemies will always try to make your perish This is no regular game. This is the real Total War.', 
                    1, "31-1-2022", "/images/medieval2.png");

create table comments(
	userid int not null references users(id),
    postid int not null references posts(id),
    content varchar(1000),
    commentDate varchar(50)    
);

create table postLikes(
	postid int not null references posts(id),
    userid int not null references users(id),
    primary key (userid, postid)
);



/*drop database node_db;*/
