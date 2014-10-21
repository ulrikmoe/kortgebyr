KORTGEBYR
================

![Alt text](/screenshot.png?raw=true "kortgebyr screenshot")

Udviklet af Ulrik Moe, Christian Blach og Joakim Sindholt.

Kortgebyr er en dansk prissammenligningsside for betalingsløsninger og betalingsgateways. Siden er skrevet i Javascript og hostet på Amazon S3. Formålet med siden er at gøre markedet for betalingsløsninger overskueligt og forståeligt for den gennemsnitlige iværksætter.


Installer lokalt
=================

Det er nemt at bidrage til projektet. Du skal blot installere <a href="http://gruntjs.com">Grunt</a> via npm, som er en package manager der følger med <a href="http://nodejs.org/download/">Node</a>.

<pre>
npm update
npm install -g grunt-cli
</pre>

Når GruntJS er installeret skal du blot, med udgangspunkt fra den folder hvor du gemmer kortgebyr <code>cd kortgebyr</code>, køre følgende komando:

<pre>
npm install
</pre>

npm installerer alle nødvendige pakker (devDependencies i Package.json).
For at starte grunt skal du blot køre komandoen:
<pre>
grunt dev
</pre>


LICENSE
============
Koden er udgivet under [GPLv3](GPLv3.md). Alle logoer og kortikoner tilhører de respektive ejere.
