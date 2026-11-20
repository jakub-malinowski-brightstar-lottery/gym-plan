# Plan treningowy — osobisty tracker

[Otwórz plan treningowy](https://jakub-malinowski-brightstar-lottery.github.io/gym-plan/)

Prosty plan na telefon, który chcemy stopniowo rozbudować w tracker pomagający
zacząć trening, zauważyć postęp i wrócić po przerwie. Bez konta, reklam i presji
na idealną serię.

## Co już działa

- Tygodniowy plan: trzy treningi siłowe, trzy marszobiegi z dodatkami i niedzielna regeneracja.
- Tabela zasad progresji ciężaru.
- Statyczna strona na GitHub Pages, otwierana również na iOS.
- Mobilna karta „Dzisiaj” i tygodniowy plan w formie kart na telefonie.
- Rozwijana rozgrzewka tylko w karcie „Dzisiaj”: stały schemat na pon./śr./pt.
  przed marszobiegiem i na wt./czw./sob. przed siłą; w niedzielę bez rozgrzewki.
- Automatyczny zapis wyników ćwiczeń w karcie „Dzisiaj” i podgląd wyłącznie
  ostatniego wcześniejszego wyniku tego samego ćwiczenia, niezależnie od dnia tygodnia.

Na głównym ekranie są karta „Dzisiaj” i plan tygodnia bez kontrolek historii.
Pod planem zostaje tylko rozwijana sekcja „Jak zwiększać ciężar?”.
Przegląd historii oraz eksport i import kopii zostały usunięte z aplikacji.
Nagłówek strony zawiera tylko tytuł „Plan Treningowy”.
Karta „Dzisiaj” pokazuje datę w jednej linii z dniem tygodnia,
ćwiczenia i domyślnie zwiniętą rozgrzewkę,
bez odhaczania i wyboru statusu. Plan tygodnia nie zawiera opisów rozgrzewek.
Aplikacja nie odczytuje ani nie zapisuje statusów ukończenia treningów.
Istniejące wpisy starej historii w pamięci przeglądarki nie są usuwane.

### Wyniki ćwiczeń

- Marszobieg: dowolny opis do 2000 znaków.
- Ćwiczenia siłowe: liczba serii, wspólna liczba powtórzeń na serię i ciężar w kg
  (także zero, gdy nie ma dodatkowego obciążenia).
- Plank i Wall Sit: liczba serii i wspólny czas na serię w sekundach.
- Zapis następuje po zmianie i opuszczeniu pola. Można uzupełniać wynik częściowo,
  poprawiać go w bieżącym dniu albo wyczyścić wszystkie pola, aby usunąć dzisiejszy wynik.
- Dzisiejsze pola są odtwarzane po odświeżeniu; poprzedni wynik nie wypełnia ich automatycznie.
  W niedzielę nie ma pól wyników.
- Wyniki są lokalne dla tej przeglądarki, bez synchronizacji i eksportu.
  Wyczyszczenie danych witryny usuwa wyniki. Błędy pamięci są wyświetlane jawnie;
  uszkodzonych danych aplikacja nie nadpisuje.

Pierwotny zakres etapu 1 został uproszczony zgodnie z opisem powyżej.
Poniższa roadmapa opisuje pomysły i pierwotne założenia,
nie gotowe możliwości strony.

## Zasady projektowania

- **Mniej klikania niż ćwiczenia.** Zakończenie treningu jednym przyciskiem; szczegóły opcjonalne.
- **Postęp zamiast poczucia winy.** Bez kar, utraty punktów i czerwonych komunikatów za przerwę.
- **Odpoczynek jest częścią planu.** Niedziela nie obniża wyniku, nie zachęcamy do trenowania codziennie.
- **Bezpieczna regularność.** Brak nagród za ignorowanie bólu, dokładanie ponad plan czy nadrabianie kilku sesji jednego dnia.
- **Telefon przede wszystkim.** Duże przyciski, czytelne karty i obsługa jedną ręką.
- **Moje dane są moje.** Lokalny zapis, eksport i możliwość usunięcia historii.

## Pomysły na motywację

### 1. Karta „Dzisiaj” — nie muszę się zastanawiać

Po otwarciu widzę dzisiejszy trening, ćwiczenia i przycisk „Zaczynam”.
Pełny tydzień nadal jest dostępny niżej. W niedzielę karta pokazuje „Dzisiaj regeneracja”.

**Po co:** usuwa pierwszy mały opór — szukanie, co właściwie mam zrobić.

### 2. Odhaczanie i pasek tygodnia

Statusy: „Zaplanowany”, „Zrobiony”, „Częściowo” i „Pominięty”.
Pełne wykonanie można zaznaczyć jednym kliknięciem i cofnąć pomyłkę.

- Licznik pełnych treningów, np. „4 z 6”.
- Częściowe sesje widoczne osobno, bez udawania pełnego wykonania.
- Niedzielna regeneracja poza mianownikiem sześciu treningów.
- Każdy tydzień ma własną historię; nowy tydzień nie usuwa poprzedniego.
- Możliwość poprawienia wpisu z wcześniejszego dnia.

**Po co:** daje natychmiastową satysfakcję i widoczny ślad wysiłku.

### 3. „Tylko pierwszy krok” — tryb na dzień bez chęci

Opcjonalny przycisk pokazujący mały krok: „Przygotuj strój” albo
„Zacznij spokojną rozgrzewkę i oceń samopoczucie”. Potem można kontynuować,
zapisać część treningu albo zakończyć bez kar.

To nie losowo skrócony plan i nie komunikat „ćwicz mimo bólu lub choroby”.

**Po co:** pomaga zacząć, ale zostawia prawo do odpoczynku.

### 4. „Ostatnio zrobiłeś…” — cel na wyciągnięcie ręki

Przy ćwiczeniu widać poprzedni ciężar i powtórzenia w każdej serii,
np. „Ostatnio: 40 kg — 8 / 8 / 7”.

- Szybkie skopiowanie poprzednich wyników i ich edycja.
- Podpowiedź: „Jeszcze jedno powtórzenie w ostatniej serii do górnej granicy”.
- Po osiągnięciu celu z tabeli progresji: sugestia rozważenia zwiększenia ciężaru,
  nie automatyczna zmiana.
- Osobny zapis czasu dla planka i Wall Sit oraz czasu marszobiegu.

**Po co:** zamienia ogólne „muszę ćwiczyć” w konkretny, mały cel.

### 5. Mapa aktywności — ogród zamiast zerwanej serii

Kalendarz ostatnich tygodni z różnymi oznaczeniami siły, marszobiegu,
częściowej sesji i regeneracji. Kolory mają też symbole lub etykiety.

Nie ma licznika, który po jednym opuszczonym dniu spada z 40 do zera.
Zamiast tego: „W ostatnich 4 tygodniach wykonałeś 15 treningów”.

**Po co:** pokazuje długofalową regularność, nie perfekcję.

### 6. Odznaki za rzeczy, które warto powtarzać

- „Pierwszy krok” — pierwszy zapisany trening.
- „Wracam do gry” — pierwszy trening po co najmniej tygodniowej przerwie.
- „Mała kolekcja” — 10, 25 i 50 ukończonych treningów łącznie.
- „Rytm” — realizacja samodzielnie wybranego celu przez cztery tygodnie;
  bez odbierania zdobytej odznaki po słabszym tygodniu.

Bez rankingów, nagród za maksymalny ciężar i wyzwań na jak najwięcej sesji.
Animacje krótkie, opcjonalne i respektujące ograniczenie ruchu w systemie.

**Po co:** docenia także powroty, a nie tylko nieprzerwane pasmo sukcesów.

### 7. Niedzielne podsumowanie — trzy konkretne zdania

Przykład oparty na faktycznie zapisanych danych:

> Wykonane treningi: 4 z 6.
>
> Wiosłowanie: o 2 powtórzenia więcej przy tym samym ciężarze niż poprzednio.
>
> Co pomogło Ci zacząć w tym tygodniu?

Jeżeli brakuje porównywalnych wyników, nie wymyślamy rekordu.
Podsumowanie jest dostępne na stronie; nie wymaga maili ani powiadomień.

**Po co:** pomaga zauważyć postęp, który łatwo przeoczyć.

### 8. „Dlaczego to robię?” — własny powód na gorszy dzień

Opcjonalne zdanie zapisane przez użytkownika, np. „Chcę mieć więcej energii po pracy”.
Pokazywane dyskretnie przy rozpoczęciu treningu, z możliwością ukrycia.

**Po co:** osobisty powód jest bliższy niż losowy cytat motywacyjny.

### 9. Rytuał końca treningu

Po zapisie krótki komunikat oparty na faktach: „Zapisane — to Twój 12. trening”.
Opcjonalnie jedno kliknięcie samopoczucia i krótka notatka.
Bez obowiązkowego formularza po każdej sesji.

**Po co:** daje przyjemne domknięcie i pozwala później dostrzec własne wzorce.

### 10. Timer, który nie przeszkadza

Prosty timer przerw oraz odliczanie dla planka i Wall Sit.
Widoczny czas zakończenia i możliwość zatrzymania; dźwięk tylko po zgodzie.

Na iOS nie zakładamy niezawodnego alarmu po zablokowaniu ekranu.
Po powrocie timer przelicza czas z zapisanej godziny końca, zamiast polegać
wyłącznie na tykaniu skryptu w tle.

**Po co:** mniej przełączania między aplikacjami w trakcie treningu.

## Proponowana kolejność wdrażania

### Etap 1 — chcę tu wracać

- [x] Mobilna karta „Dzisiaj” i dostęp do pełnego planu.
- [x] Odhaczanie, cofanie oraz status częściowej i pominiętej sesji.
- [x] Pasek tygodnia i lokalna historia przypisana do dat.
- [x] Krótkie potwierdzenie zakończenia treningu.
- [x] Eksport i import kopii danych oraz jawny komunikat, gdy zapis się nie uda.

**Gotowe, gdy:** na iPhonie można zapisać trening, zamknąć stronę i po powrocie
zobaczyć ten sam wynik. Niedziela nie zmienia celu 6 sesji. Zmiana tygodnia
zachowuje poprzednie wpisy, a pomyłkę można poprawić.

### Etap 2 — widzę, że idę do przodu

- [ ] Ciężary, powtórzenia i czas odpowiednio do rodzaju ćwiczenia.
- [ ] Poprzedni wynik i ostrożne podpowiedzi progresji.
- [ ] Mapa aktywności i podsumowanie tygodnia.
- [ ] Własny powód treningu oraz „Tylko pierwszy krok”.

**Gotowe, gdy:** kolejna sesja pokazuje właściwy poprzedni wynik dla tego samego
ćwiczenia, bez mieszania lekkiego przysiadu ze zwykłym, i nie ogłasza rekordu
na podstawie nieporównywalnych danych.

### Etap 3 — wygoda i małe nagrody

- [ ] Odznaki za regularność, łączną liczbę treningów i powroty.
- [ ] Timer przerw i ćwiczeń na czas.
- [ ] Instalowalna PWA z ikoną i działaniem offline po pierwszym poprawnym załadowaniu.
- [ ] Dyskretna informacja o nowej wersji, bez utraty rozpoczętego wpisu.

**Gotowe, gdy:** po przygotowaniu trybu offline można otworzyć aplikację z ekranu
początkowego bez internetu, odczytać plan i zapisać wynik. Aktualizacja nie kasuje historii.

## Technika i ograniczenia

- Punkt wyjścia: [index.html](./index.html), zwykły HTML, CSS i stopniowo dodawany JavaScript.
- Hosting: GitHub Pages, bez backendu i bazy danych na serwerze.
- Pierwsza wersja zapisu używa `localStorage`; dane zostają w danej przeglądarce
  lub aplikacji webowej. Nie obiecujemy współdzielenia ich między Safari a ikoną PWA.
- Brak synchronizacji między telefonem a komputerem. Eksport/import JSON zapewni
  ręczne przenoszenie i kopię zapasową.
- Wyczyszczenie danych witryny może usunąć historię. Potrzebny widoczny opis tej zasady
  oraz przypomnienie o kopii, bez obietnicy trwałości danych.
- Import wymaga walidacji formatu i potwierdzenia przed zastąpieniem obecnej historii.
- Daty i tygodnie liczymy według lokalnej daty użytkownika, od poniedziałku;
  sprawdzamy przejście roku i zmianę czasu.
- Wyniki treningów nie trafiają do publicznego repozytorium. Publiczne są kod i plan.
- Błędy zapisu mają być widoczne; komunikat „Zapisano” dopiero po udanym zapisie.
- PWA i offline wymagają dodatkowych plików oraz testów na iOS.
- Powiadomienia push na iOS wymagają obsługiwanej wersji systemu, instalacji na ekranie
  początkowym i zgody. Nie są częścią pierwszego etapu ani prostym dodatkiem bez infrastruktury.

## Uruchomienie i testy

Nie ma zależności do instalowania ani kroku budowania.
Ze względu na moduły JavaScript korzystaj z HTTP, nie otwieraj pliku przez `file://`.

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Otwórz `http://127.0.0.1:8765`. GitHub Pages publikuje stronę z katalogu głównego
gałęzi `main`.

GitHub Pages może buforować zasoby przez 10 minut. Przy publikacji zmian JS/CSS
aktualizuj parametr `v` w adresach zmienionych zasobów: w `index.html` oraz
w importach modułów. Dzięki nowemu adresowi Safari pobierze nową wersję pliku.
Jeśli telefon nadal pokazuje starą stronę, otwórz adres witryny z nowym parametrem,
np. `?v=20261120-1`, aby odświeżyć również dokument HTML.
Nie usuwaj danych witryny w celu odświeżenia — usunęłoby to lokalne wyniki.

Testy logiki wyników, historii i dat (Node.js 22 lub nowszy):

```powershell
$env:TZ = 'Europe/Warsaw'
node --test tracker.test.mjs results.test.mjs
```

Przed publikacją sprawdź też w przeglądarce: dzisiejszą datę i ćwiczenia, wyróżnienie
bieżącego dnia w planie, zmianę dnia oraz rozwijanie zasad progresji.
Sprawdź zapis i poprawianie wyników, odświeżenie strony, ostatni wcześniejszy
wynik, wyczyszczenie pól oraz komunikaty przy niedostępnej lub uszkodzonej pamięci.
Obsługę iOS po zmianach należy potwierdzić na fizycznym urządzeniu; emulacja
szerokości ekranu nie zastępuje testu Safari.

## Czego na razie nie budujemy

- Logowania, chmury i automatycznej synchronizacji.
- Społeczności, rankingów i porównywania sylwetek.
- Systemu kalorii, diet i kontroli masy ciała.
- Automatycznego zmieniania planu na podstawie samopoczucia.
- Rozbudowanej gry, która wymaga więcej uwagi niż sam trening.

**Pierwszy wybór:** karta „Dzisiaj” + odhaczanie + pasek tygodnia + bezpieczny zapis
z kopią danych. Następnie poprzednie wyniki — najbardziej namacalny powód, żeby wracać.
