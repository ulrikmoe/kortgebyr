CHANGELOG
==================

TO DO: Finde en smart måde at tilføje Nordpay, Pensio m.fl.

TO DO: Finde en smart måde at "straffe" bindingsperioder

TO DO: Hvis dankort er enabled så skal løsninger der ikke tilbyder rene-denkort flyttes til bunden og have en class der markerer at de er disabled. Samme gælder alle andre features f.eks. svindelkontrol, paii osv.

TO DO: Mulighed for at vælge Maestro, American Express, JCB, Diners, Forbrugsforeningen (Vent med denne, skal vi gennemtænke).
-> KOMMENTAR Uenig. Disse er kort er stort set irrelevante, og giver unødvendigt bloat.

TO DO: Mulighed for at vælge Paii, MobilePay (disabled), Swipp (disabled).

TO DO: Fakturabetaling. For at gøre det simpelt er dette bare om løsningen tilbyder nogen som helst form for fakturabetaling. Interessant pga. potentiel merværdiskabelse for webshops.

TO DO: Indløsningsaftale skal som udgangspunkt være sat til Automatisk og vi skal så vælge den billigste indløser (som udgangspunkt Teller medmindre denne ikke er en mulighed). Ved Automatisk vil løsninger som Yourpay være synlige, men vælger man f.eks. at ændre Automatisk til Teller, så forsvinder Yourpay og lignende løsninger.
-> KOMMENTAR Dette kan i praksis ikke lade sig gøre da indløsningsaftaler hos mange indløsere forhandles (herunder SEB Euroline), og altså er priserne ikke offentlige.

20/04 2014
==================
- Tilføjet penalty hvis Gateway'en ikke tilbyder dankort og brugeren beder om det.

19/04 2014
==================
- tilføjet Metode
- Fixet regnefejl for NETS ved transaktioner over 100kr

18/04 2014
==================
- tilføjet Payza
- tilføjet Payer
- tilføjet Point
- tilføjet certitrade

15/04 2014
==================
- fixet mindre regnefejl for Teller
- tilføjet Scannet
- tilføjet skrill

14/04 2014
==================
- medregner chargeback (risiko = 0,03 %)

13/04 2014
==================
- oprettet changelog.md
- nyt design/layout
- tilføjet yourpay
- fjernet ewire
- opdateret netaxept priser (indeksregulering)
- opdateret gns. ordreværdi (570 -> 500)
- tjekket alle priser
- medregner nu 3D-secure oprettelsesgebyr