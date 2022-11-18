// ==UserScript==
// @name         HIMARS
// @version      4.2
// @description  Humiliating IMageboard ARmy  Script
// @match        *://2ch.hk/*
// @match        *://2ch.life/*
// ==/UserScript==

const vatniks = [
	[ "logos/comm.png" , "/flags/A1.png" ], // Сева
	[ "logos/comm.png" , "/flags/AT.png" ], // Сева
	[ "/flags/.png"    , "logos/nya.png" ], //Пидор без флага с nyan-cat
	[ "/flags/NO.png" ] //путает /ga/ и /po/
];
const phrases = [
	"Это не сперма, а столярный клей!!!",
	"Нахуй путешествую",
	"Ко-ко-ко! Ку-ка-ре-ку!",
	"Батько наш Бандера, Україна — мати!",
	"Сегодня сварил чай из лапухов на родниковой воде с Макеевки, это был лучший чай в моей жизни!<br><span class=\"thanks-abu\" style=\"color: red;\">Абу благословил этот пост.</span>",
	"Швабра - орудие пролетариата",
	"Володин и Пригожин не геи!!1111",
	"<b>ВРЁТИИИИИИИИИИИИИИИИИИ</b>",
	"Бывает, я как-то в детстве из коляски выпал до сих пор мне говорят что я особенный",
	"Как научиться говорить паляниця?",
	"Лиман наш!",
	"По крымскому мосту можно теперь доехать до крейсера \"Москва\" ничего вы не понимаете!",
	"Прежде чем стирать штаны нам нужно понять для чего это нужно делать, если с коммунизмом всё чётко и понятно описано сотнями книг, то что делать со штанами вопрос дискуссий и исследований",
	"Вот когда повестка придёт тогда и пойду, но меня не возьмут с инвалидностью",
	"Сейчас еще немного и вот начнут по настоящему и как возьмут Киев за 3 дня, я погляжу как вы захрюкаете",
	"Крейсер \"Москва\" уже особо не нужен был, его бы и так списали",
	"Ну и правильно что Азов обменяли на Медведчука, нахуя нам их кормить и содержать?",
	"Сталин взял страну с лопатой и граблями, а вернул с тракторами и победой. Да был геноцид и что с этого, без жертв не случиться прогресс",
	"ПТН - ХЛО<br>Лалалала лала лала ла",
	"Голодомора не было это всё фейки ЧИПСО! Был геноцид, но это было оправдано тем временем",
	"Подумаешь окопались в рыжем лесу, в Великую Отечественную там тоже были бои, партизаны жили в этом лесу и ничего все остались живы и здоровы!",
	"Это был отвлекающий маневр Киев никто брать не хотел, как и Изюм с Лиманом",
	"Всё было по плану и даже с опережением графика, меньше нужно слушать всяких телеграмщиков, а узнавать из официальных источников",
	"Если отводят войска это не отступают, а значит так решило командование",
	"Коммунист - друг человека, а те кто это не понимает будут объявлены врагами народа и расстреляны",
	"Я прошу передать Абу, что я никогда в жизни политически не обманывал двач, о чем знают тысячи лиц, знающие мою честность и скромность. Прошу передать Абу, что все то, что случилось со мною, является просто стечением обстоятельств и не исключена возможность, что и враги приложили свои руки, которых я проглядел. Передайте Абу, что в бане я буду с его именем на устах",
	"Коммунизм - это наука доказанная диалектикой, значит все теории коммунизме правильные, это в очередной раз доказывает главную аксиому Карла Маркса",
	"Вот объясните мне почему плохо ходить в грязных штанах? Я просто пытаюсь разобраться"
];
const user_ids = [ "Тупой Лахтобот", "Грязноштанный Сёва", "Макеевский Родничок", "Копиумный Наркоман", "Меня Ебали", "Тюремный Газонюх", "Бесячий Цыган", "Лягушка Нахуй-Путешественница" ];
var interval; //глобальный цикл

function toggle_visibility(img) {
	if (img == null) return;
	const shitpost = img.parentElement.querySelector("article");
	if (img.style.display) {
		shitpost.style.paddingLeft = "";
		img.style.display = "";
	} else {
		shitpost.style.paddingLeft = "16px";
		img.style.display = 'none';
	}
}

function fix_link(l) {
	if (l.classList.contains("himarsed")) return;
	l.addEventListener('mouseover', function() { clown_listener(100) },false);
	l.classList.add("himarsed");
}

function add_details(el, html) {
	const details = document.createElement("details");
	const summary = document.createElement("summary");
	const p = document.createElement("p");
	summary.innerText = "..."
	p.innerHTML = html;
	details.appendChild(summary);
	details.appendChild(p);
	details.style.cursor = "pointer";
	details.style.fontSize = "10px";
	details.addEventListener('click',function() {
		const imgs = this.parentNode.parentNode.querySelector(".post__images");
		toggle_visibility(imgs);
	},false);
	el.appendChild(details);
}

function change_text(el) {
	const e = el.querySelector("article");
	const shit_text = e.innerHTML;
	const links = e.querySelectorAll(".post-reply-link");
	const post_num = el.querySelector(".post__reflink").id;
	e.innerHTML = phrases[post_num % phrases.length];
	links.forEach(l => {
		fix_link(l);
		e.insertBefore(document.createElement("br"), e.firstChild);
		e.insertBefore(l, e.firstChild);
	});
	add_details(e, shit_text);
}

function change_id(el) {
	const e = el.querySelector(".post__anon,.post__email").querySelector("span");
	const magic = e.innerHTML.length;
	e.innerHTML = user_ids[ magic % user_ids.length].replaceAll(' ',"&nbsp;");
}

function himars(el) {
	if (el.classList.contains("himarsed")) return;
	toggle_visibility(el.querySelector(".post__images"));
	change_text(el);
	change_id(el);
	el.classList.add("himarsed");
}

async function clown_listener(t) {
	await new Promise(r => setTimeout(r, t));
	main();
}

async function auto_update(obj) {
	await new Promise(r => setTimeout(r, 1000));
	obj.checked ? interval = setInterval(main, 15000) : clearInterval(interval);
}

function main() {
	console.log("Орудие!");
	document.querySelectorAll(".post-reply-link").forEach(fix_link);
	[...document.querySelectorAll(".post_type_reply")]
	.filter(post => vatniks.some( v => v.every( c => post.innerHTML.includes(c))))
	.forEach(himars);
}

function first() {
	const add_listener = (e,t=2600) => e.addEventListener(
		'click', function() { clown_listener(t) },false);
	main();
	document.querySelectorAll(".autorefresh-checkbox").forEach( checkbox => {
		checkbox.addEventListener('click', function() { auto_update(this) },false);
		auto_update(checkbox); });
	document.querySelectorAll(".js-update-thread").forEach(x => add_listener(x,1000));
	add_listener(document.querySelector("#submit"));
   	add_listener(document.querySelector("#qr-submit"));
}

document.body.onload = first;
