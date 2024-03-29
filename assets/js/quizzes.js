
class Quizzes extends Phaser.Scene {
    constructor() {
        super({ key: 'Quizzes' });
        this.playMusic;
        this.confirm;
        this.correct;
        this.wrong;
        this.beginnerPhases = [
            { 
                phase: 1, 
                title: "Fase 1: Monte a estrutura base de um algoritmo", 
                tips: ["Primeiro declaramos as variáveis"], 
                code: [ "var", 
                        "inicio", 
                        "fimalgoritmo"]
            },
            {
                phase: 2, 
                title: "Fase 2: Monte o algoritmo para declarar duas variáveis do tipo inteiro", tips: ["Nomeie as variáveis sem espaço, caractere especial e sem iniciar com número ou letra maiúscula"], 
                code: [ "var", 
                        "num1, num2: inteiro", 
                        "inicio", 
                        "fimalgoritmo"]
            },
            {
                phase: 3, 
                title: "Fase 3: Monte o algoritmo para ler um número inteiro e mostrá-lo na tela", tips: [""], 
                code: [ "var", 
                        "num: inteiro", 
                        "inicio", 
                        "leia(num)", 
                        "escreva(num)", 
                        "fimalgoritmo"]
            },
            {
                phase: 4, 
                title: "Fase 4: Monte o algoritmo para ler dois números e exibir a soma deles", tips: [""], 
                code: [ "var",
                        "num1, num2, soma: inteiro",
                        "inicio",
                        "leia(num1)",
                        "leia(num2)",
                        "soma <- num1 + num2",
                        "escreva('A soma dos números é: ', soma)",
                        "fimalgoritmo"]
            },
            {
                phase: 5, 
                title: "Fase 5: Monte o algoritmo para ler um número inteiro e mostrar se ele é par ou ímpar", tips: [""], 
                code: [ "var",
                        "num: inteiro",
                        "inicio",
                        "leia(num)",
                        "se num % 2 = 0 entao",
                        "escreva(num, ' é par.')",
                        "senao",
                        "escreva(num, ' é ímpar.')",
                        "fimse",
                        "fimalgoritmo"]
            },
        ]
        this.phaseIndex = 0;
        this.phase = this.beginnerPhases[this.phaseIndex];
        this.phaseTitle;
        this.phaseTips;
        this.phaseCode;
        this.column;
        this.lines;
        this.quizzCode = [];
        this.currentOrder = [];
        this.codeIndex = 0;
    }

    preload() {
        this.load.audio('playMusic', './assets/sfx/elapse.mp3');
        this.load.audio('confirm', './assets/sfx/confirm.mp3');
        this.load.audio('correct', './assets/sfx/correct.mp3');
        this.load.audio('wrong', './assets/sfx/wrong.mp3');
    }

    create() {

        // Adiciona o fundo
        this.add.image(0, 0, 'quarto').setOrigin(0);

        this.playMusic = this.sound.add('playMusic', { loop: true });
        this.playMusic.setVolume(0.1);
        this.correct = this.sound.add('correct');
        this.correct.setVolume(0.8);
        this.wrong = this.sound.add('wrong');
        this.wrong.setVolume(0.4);

        this.showQuizScreen(this.phase);
                 
    }

    update() {

    }

    // Função para embaralhar uma lista
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    showQuizScreen(phase) {
        this.phase = phase;
        this.phaseTitle = this.phase.title;
        this.phaseTips = this.phase.tips;
        this.phaseCode = this.phase.code;
        
         // Obtenha a altura total das opções arrastáveis (supondo que você tenha um array chamado 'options' contendo as opções)
         let totalObjectsHeight = this.phaseCode.length * 50 + 300; // Supondo que cada opção tenha uma altura de 50 pixels

         // Defina a altura do canvas com base na altura total das opções arrastáveis
         let canvasHeight = Math.max(600, totalObjectsHeight); // Defina uma altura mínima de 600 pixels
 
         // Defina o tamanho do canvas
         this.scale.setGameSize(800, canvasHeight);

        // Adiciona a caixa de diálogo
        this.dialogueBox = this.add.rectangle(400, canvasHeight, 10, 570, 0x000000, 0.9).setOrigin(0.5, 0.5);
    
        // Mostrando parte da dialogueBox
        this.tweens.add({
            targets: this.dialogueBox,
            y: 285,
            duration: 200, // Duração da animação em milissegundos (0.5 segundo neste caso)
            ease: 'Linear'
        });

        setTimeout(() => {
            // Expandindo a dialogueBox
            this.tweens.add({
                targets: this.dialogueBox, // O alvo da animação é o sprite do personagem
                scaleX: 60, // Fator de escala vertical
                duration: 200, // Duração da animação em milissegundos (0.5 segundo neste caso)
                ease: 'Linear' // Tipo de easing (suavização) da animação
            });
        }, 300);

        // Adiciona o titulo no painel
        this.textPhaseTitle = this.add.text(400, -100, this.phaseTitle, { fontFamily: 'Arial', fontSize: '16px', fill: '#ffffff', marginTop: '10px' }).setOrigin(0.5, 0).setWordWrapWidth(500); // Largura máxima da caixa de texto

        setTimeout(() => {
            // Animaçao do titulo
            this.tweens.add({
                targets: this.textPhaseTitle, // O alvo da animação é o texto com o título
                y: 35, // Fator de escala vertical
                duration: 300, // Duração da animação em milissegundos (0.5 segundo neste caso)
                ease: 'Linear', // Tipo de easing (suavização) da animação
            });
        }, 300);

        // Embaralha as opções
        this.quizzCode = this.shuffle([...this.phaseCode]); // Cópia embaralhada do phaseCode

        const column = document.createElement('div');
        column.className = 'column';

        // Criação de três divs filhas com classe "line" e atributo draggable definido como true
        for (let i = 0; i < this.phaseCode.length+1; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line animacao';
            lineDiv.draggable = true;
            // Defina o conteúdo do div como a string atual
            lineDiv.textContent = this.quizzCode[i];
            column.appendChild(lineDiv);
            if(i == this.phaseCode.length) {
                lineDiv.classList.remove("animacao");
            }
        };

        // Adiciona a div pai ao corpo do documento
        document.body.appendChild(column);

        const lines = document.querySelectorAll(".line");

        document.addEventListener("dragstart", (e) => {
            e.target.classList.add("dragging");
        });

        document.addEventListener("dragend", (e) => {
            e.target.classList.remove("dragging");
        });

        // Botão para verificar a ordem das opções
        const button = this.add.text(400, canvasHeight-80, 'Confirmar', { fontFamily: 'Arial', fontSize: '18px', fill: '#fff', backgroundColor: '#00BBFF', borderRadius: 10, padding: 15, color: '#fff', fontWeight: 'bold' }).setOrigin(0.5, 0);
        button.setInteractive();
        button.on('pointerdown', () => {
            // Verifica a ordem quando necessário (por exemplo, quando o jogador clica em um botão)
            if (this.checkOrder()) {
                this.clearLines();
                this.showCorrect(canvasHeight);
                this.correct.play();

                // Itera sobre cada elemento filho e aplica uma cor de fundo
                for (var i = 0; i < lines.length-1; i++) {
                    lines[i].style.backgroundColor = '#228b22'; // Defina a cor de fundo desejada aqui
                }
                this.phaseIndex++;
                this.phase = this.beginnerPhases[this.phaseIndex];
                button.y = canvasHeight-80;
                setTimeout(() => {
                    // Remove todos os elementos filhos e inicia a proxima cena
                    while (column.firstChild) {
                        column.removeChild(column.firstChild);
                    }  
                    this.textPhaseTitle.destroy();
                    button.destroy();
                    this.showQuizScreen(this.phase);
                }, 3000);
            } else {
                this.showWrong(canvasHeight);
                this.wrong.play();
            }
            
        });

        // Evento de hover
        button.on('pointerover', () => {
            button.setStyle({ fontSize: '20px', backgroundColor: '#0077FF' }); // Cor amarela ao passar o mouse
        });

        // Evento de hout
        button.on('pointerout', () => {
            button.setStyle({ fontSize: '18px', backgroundColor: '#00BBFF' }); // Restaura a cor original ao retirar o mouse
        });

        // Evento arrastar e soltar as opções
        lines.forEach((item) => {
            item.addEventListener("dragover", (e) => {
                e.preventDefault(); // Previne o comportamento padrão de não permitir soltar

                // Impede que a animação aconteça ao realocar uma linha e que a coluna volte para o início
                for (let i = 0; i < lines.length; i++) {
                    lines[i].style.transform = "translateX(0%)";
                    lines[i].classList.remove('animacao');
                }

                const dragging = document.querySelector(".dragging");
                const cards = column.querySelectorAll(".line:not(.dragging)");
        
                // Encontra o elemento de referência baseado na posição do cursor
                const referenceCard = Array.from(cards).find((card) => {
                    const box = card.getBoundingClientRect();
                    const boxCenterY = box.top + box.height / 2;

                    return e.clientY > box.y && e.clientY < boxCenterY;
                });

                if (referenceCard) {

                    referenceCard.insertAdjacentElement("beforebegin", dragging);
                } else {
                    referenceCard.insertAdjacentElement("beforeend", dragging);
                }
            });
        });

    }

    // Função para exibir o texto de forma gradual
    typeText(textObject, text, index, callback) {
        if (index < text.length) {
            textObject.text += text[index];
            index++;
            setTimeout(() => {
                this.typeText(textObject, text, index, callback);
            }, 40); // Velocidade de digitação (em milissegundos)
        } else {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    // Função para verificar se a ordem dos textos nas divs é igual ao array inicial
    checkOrder() {
        const lineDivs = document.querySelectorAll(".line");

        // Verifica se a ordem dos textos nas divs é a mesma que o array inicial
        for (let i = 0; i < lineDivs.length-1; i++) {  
            if (lineDivs[i].textContent !== this.phaseCode[i]) {
                return false;
            }
        }

        return true;
    }

    clearLines() {
        const lines = document.querySelectorAll(".message");
        lines.forEach((line) => {
            document.body.removeChild(line);
        });
    }

    showCorrect(alturaTela) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
        messageDiv.textContent = "Você acertou!";

        
        messageDiv.style.position = 'fixed';
        messageDiv.style.left = '50%';
        messageDiv.style.top = alturaTela + 50 + 'px';

        // Adiciona a mensagem à tela
        document.body.appendChild(messageDiv);

        // Aplica a animação CSS à mensagem
        setTimeout(() => {
            messageDiv.classList.add("message-show");
            messageDiv.id = 'message-correct';
        }, 100);

        // Remove a mensagem após algum tempo
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000); // Tempo em milissegundos antes de remover a mensagem
    }

    showWrong(alturaTela) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
        messageDiv.textContent = "Errado! Tente de novo!";

        // Adiciona a mensagem à tela
        document.body.appendChild(messageDiv);

        messageDiv.style.position = 'fixed';
        messageDiv.style.left = '50%';
        messageDiv.style.top = alturaTela + 50 + 'px';

        // Aplica a animação CSS à mensagem
        setTimeout(() => {
            messageDiv.classList.add("message-show");
            messageDiv.id = 'message-wrong';
        }, 100);

        // Remove a mensagem após algum tempo
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000); // Tempo em milissegundos antes de remover a mensagem
    }
}   