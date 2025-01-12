# Accessibilitat i Usabilitat en el Desenvolupament Web

## 1. Llista de Tasques Provades

Per avaluar l'accessibilitat i la usabilitat de l'aplicació, hem definit les següents tasques bàsiques que un usuari hauria de poder realitzar:

1. **Registrar una nova cita (reserva):**
    - Omplir tots els camps del formulari de creació d'una cita, incloent cerca de client i treballador.
    - Seleccionar serveis i completar la reserva.
2. **Consultar les estadístiques d'una categoria específica (serveis associats):**
    - Visualitzar les estadístiques relacionades amb els serveis seleccionats en les reserves.
3. **Navegar fàcilment per les pàgines del Dashboard:**
    - Accedir a les seccions principals com ara `Clients`, `Treballadors`, i `Reserves` sense dificultats.

---

## 2. Verificació d'Accessibilitat

### **Eines Utilitzades**
- **Wave:** Per identificar problemes d'accessibilitat general.
- **Chrome DevTools - Audits:** Per avaluar aspectes com el contrast de colors, etiquetes ARIA i compatibilitat amb teclat.

### **Problemes Identificats**
1. **Contrast de Colors (Prioritat Alta):**
    - Algunes seccions del formulari (e.g., inputs i etiquetes) tenen un contrast insuficient entre text i fons, especialment en camps deshabilitats.

2. **Falten Etiquetes ARIA (Prioritat Mitjana):**
    - Datalist per cercar clients i treballadors no inclou etiquetes descriptives accessibles.

3. **Manca de Navegació amb Teclat (Prioritat Alta):**
    - Les opcions de paginació dels serveis no són fàcilment accessibles amb teclat.

4. **Feedback Visual (Prioritat Mitjana):**
    - No hi ha indicadors clars per als errors en formularis (e.g., si falten camps obligatoris).

---

## 3. Observacions Durant les Proves amb Usuaris

### **Usuari 1: Familiaritzat amb Tecnologia**
- **Temps per completar una reserva:** 3 minuts.
- **Problemes:**
    - No va identificar clarament el botó de guardar a causa de la seva posició.
    - Es va confondre en afegir un servei a causa de la falta d'instruccions visuals.

### **Usuari 2: Usuari ocasional**
- **Temps per completar una reserva:** 6 minuts.
- **Problemes:**
    - Es va frustrar perquè no va poder trobar fàcilment el botó "Tornar" al formulari.
    - Dificultats en la cerca d'un treballador perquè els inputs no proporcionen cap suggeriment inicial.

### **Usuari 3: Persona amb discapacitat visual**
- **Temps per completar una reserva:** No va completar.
- **Problemes:**
    - Contrast insuficient en camps deshabilitats.
    - Datalist de cerca de clients i treballadors no era navegable amb teclat.

---

## 4. Propostes de Millora

### **Accessibilitat**
1. **Millorar el contrast:**
    - Augmentar el contrast entre el text i el fons per a tots els camps del formulari, especialment els deshabilitats.
2. **Afegir etiquetes ARIA:**
    - Incloure `aria-label` o `aria-describedby` per a inputs i datalist.
3. **Facilitar la navegació amb teclat:**
    - Assegurar que tots els botons (e.g., paginació de serveis) siguin accessibles mitjançant teclat.

### **Usabilitat**
1. **Millorar el feedback visual:**
    - Afegir marcadors d'error (amb text descriptiu) per als camps obligatoris no completats.
2. **Simplificar la cerca:**
    - Afegir suggeriments inicials en els camps de cerca de clients i treballadors per orientar l'usuari.
3. **Reorganitzar els botons:**
    - Col·locar el botó de guardar en una posició més destacada i coherent.

---

## 5. Implementació i Validació

### **Millores Implementades**
1. Contrast millorat en els inputs i botons utilitzant un tema accessible (WCAG AA).
2. Afegides etiquetes ARIA per millorar la descripció dels elements interactius.
3. Fet accessible el sistema de paginació amb navegació per teclat.

### **Beneficis Aportats**
- Millora significativa en l'experiència d'usuari amb necessitats especials.
- Reducció de confusió en l'ús del formulari de reserves.
- Augment de l'eficiència per a usuaris amb menys experiència tecnològica.

---

## Conclusió

Les proves realitzades van evidenciar problemes d'accessibilitat i usabilitat en diverses funcionalitats clau. Amb les millores implementades, l'aplicació ara ofereix una experiència més intuïtiva i accessible, però cal continuar refinant aspectes basats en feedback addicional.

