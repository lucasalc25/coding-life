class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
        this.bgImage;
        this.personagem;
        this.level;
        this.dialogueBox;
        this.dialogueBoxAnimated = false;
        this.dialogueText; // Variável global para o texto do diálogo
        this.textToShow = ''; // Variável global para o texto a ser exibido
        this.currentDialogueIndex = 0;
        this.playMusic;
        this.hover;
        this.confirm;
        this.typing;
        this.textTitle;
        this.beginnerOption;
        this.intermediaryOption;
        this.advancedOption;
        this.dialogues = ["E aí! Beleza? Sou o Zack...", "Bom, você já deve saber que sua missão é me ajudar, então vamos lá...", "Vou te explicar como vai funcionar.", "Você vai precisar colocar as linhas de código na ordem certa para resolver cada problema.", "Pra isso basta você clicar com o mouse na opção que quer mudar de lugar, e sem soltar o botão, arrastá-la até a posição que deseja", "Daí você solta o botão e a opção vai ser fixada, beleza?","Primeiro preciso saber qual o seu nível de programação"]
    }

    preload() {
        this.load.image('quarto', './assets/img/quarto.png');
        this.load.image('zack', './assets/img/zack.png');
        this.load.audio('typing', './assets/sfx/typing.mp3');
        this.load.audio('playMusic', './assets/sfx/elapse.mp3');
        this.load.audio('hover', './assets/sfx/hover.mp3');
        this.load.audio('confirm', './assets/sfx/confirm.mp3');
    }

    create() {
        // Adiciona o fundo
        this.bgImage = this.add.image(0, 0, 'quarto').setOrigin(0);
        // Adiciona o personagem
        this.personagem = this.add.image(-200, this.game.canvas.height/1.5, 'zack');
        // Adiciona a caixa de diálogo
        this.dialogueBox = this.add.rectangle(-this.game.canvas.width, this.game.canvas.height/1.3, this.game.canvas.width, this.game.canvas.height/100, 0x000000, 0.7).setOrigin(0.5, 0.5);

        this.typing =  this.sound.add('typing', { loop: true });
        this.playMusic = this.sound.add('playMusic', { loop: true });
        this.hover = this.sound.add('hover');
        this.confirm =  this.sound.add('confirm');
        this.confirm.setVolume(0.05);
        this.hover.setVolume(0.4);

        // Adiciona o audio
        this.playMusic.setVolume(0.1);
        this.playMusic.play(); 

        this.showScreen();

        setTimeout(() => {
            this.showCharacter();
        }, 1000);                   
    }

    update() {
        this.checkScreen();
    }

    showScreen() {
        // Adicionando um retângulo preto que cobre a tela inteira
        const blackOverlay = this.add.rectangle(this.game.canvas.width/2, this.game.canvas.height/2, this.game.canvas.width, this.game.canvas.height, 0x000000);

        this.tweens.add({
            targets: blackOverlay,
            alpha: 0, // Transparece o retangulo que cobre a tela
            duration: 1000, // Tempo da animação em milissegundos (2 segundos)
            onComplete: () => {
                blackOverlay.destroy();
            }
        });  
    }

    endScene() {
        this.dialogueText.setText('');

        // Condensando a dialogueBox
        this.tweens.add({
            targets: this.dialogueBox, // O alvo da animação é a caixa de diálogo
            scaleY: 2, // Fator de escala vertical
            duration: 200, // Duração da animação em milissegundos (0.5 segundo neste caso)
            ease: 'Linear' // Tipo de easing (suavização) da animação
        });
        setTimeout(() => {
            // Removendo a dialogueBox 
            this.tweens.add({
                targets: this.dialogueBox,
                x: -this.game.canvas.width,
                duration: 200, // Duração da animação em milissegundos (0.5 segundo neste caso)
                ease: 'Linear',
                onComplete: () => {
                    this.tweens.add({
                        targets: this.personagem, // O alvo da animação é a imagem do personagem
                        x: -this.game.canvas.width, // Coordenada X final para onde o personagem se moverá
                        duration: 500, // Duração da animação em milissegundos (0.5 segundo neste caso)
                        ease: 'Linear', // Tipo de easing (suavização) da animação
                        yoyo: false, // Define se a animação deve se repetir reversamente (vai e volta)     
                    });
                }
            });
       }, 300) 
    }

    showCharacter() {
        this.tweens.add({
            targets: this.personagem, // O alvo da animação é a imagem do personagem
            x: this.game.canvas.width/2, // Coordenada X final para onde o personagem se moverá
            duration: 400, // Duração da animação em milissegundos (0.5 segundo neste caso)
            ease: 'Linear', // Tipo de easing (suavização) da animação
            yoyo: false, // Define se a animação deve se repetir reversamente (vai e volta)
            onComplete: () => {
                this.startDialog() 
            }        
        });
    }

    startDialog() {
        // Mostrando parte da dialogueBox
        this.tweens.add({
            targets: this.dialogueBox,
            x: this.game.canvas.width/2,
            duration: 100, // Duração da animação em milissegundos (0.5 segundo neste caso)
            ease: 'Linear'
        });

        setTimeout(() => {
            // Expandindo a dialogueBox
            this.tweens.add({
                targets: this.dialogueBox, // O alvo da animação é o sprite do personagem
                scaleY: 30, // Fator de escala vertical
                duration: 100, // Duração da animação em milissegundos (0.5 segundo neste caso)
                ease: 'Linear',
                onComplete: () => {
                    this.dialogueBoxAnimated = true;
                } // Tipo de easing (suavização) da animação
            });
        }, 300);

        setTimeout(() => {
            // Adiciona o texto da caixa de diálogo
            this.dialogueText = this.add.text(this.game.canvas.width/2, this.game.canvas.height/1.3, '', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5).setWordWrapWidth(700); // Largura máxima da caixa de texto

            this.showChoices();
            // this.nextDialogue.call(this);

        }, 500);
    }
    // Função para avançar para o próximo diálogo
    nextDialogue() {
        this.dialogueText.setText('');
        // Se ainda houver diálogos para exibir
        if (this.currentDialogueIndex < this.dialogues.length) {
            const currentDialogue = this.dialogues[this.currentDialogueIndex];
            // Exibe o próximo diálogo
            this.typeText(this.dialogueText, currentDialogue, 0, () => {
                // Espera pelo clique do jogador
                this.input.once('pointerdown', () => {
                    this.currentDialogueIndex++;
                    this.nextDialogue();
                });
            });
        } else if (this.currentDialogueIndex == this.dialogues.length){
            // Avança para a próxima cena
            this.showChoices();
        }
    }

    // Função para exibir o texto de forma gradual
    typeText(textObject, text, index, callback) {
        if (index < text.length) {
            this.typing.play();
            textObject.text += text[index];
            index++;
            setTimeout(() => {
                this.typeText(textObject, text, index, callback);
            }, 40); // Velocidade de digitação (em milissegundos)
        } else {
            if (typeof callback === 'function') {
                this.typing.stop();
                callback();
            }
        }
    }
     // Função para mostrar as opçoes de escolha
     showChoices() {
        this.textTitle = this.add.text(game.canvas.width*0.5, game.canvas.height*0.7, 'Clique no seu nível:', { fontFamily: 'Arial', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        // Cria botões de escolha
        this.beginnerOption = this.add.text(game.canvas.width*0.2, game.canvas.height*0.8, 'Iniciante', { fontFamily: 'Arial', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.intermediaryOption = this.add.text(game.canvas.width*0.5, game.canvas.height*0.8, 'Intermediário', { fontFamily: 'Arial', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.advancedOption = this.add.text(game.canvas.width*0.8, game.canvas.height*0.8, 'Avançado', { fontFamily: 'Arial', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        // Configurando interações dos botões
        [this.beginnerOption, this.intermediaryOption, this.advancedOption].forEach(button => {
            button.setInteractive();

            button.on('pointerdown', () => {
                this.level = button.text;
                this.confirm.play();
                this.textTitle.setText('');
                [this.beginnerOption, this.intermediaryOption, this.advancedOption].forEach(option => {
                    option.setText('');
                });
                this.typeText(this.dialogueText, `Então você é nível ${this.level}. Beleza!\nQue comecem os jogos!`, 0, () => {
                    // Espera pelo clique do jogador
                    this.input.once('pointerdown', () => {
                        this.endScene()
                        setTimeout(() => {
                            this.scene.start('Quizzes');
                        }, 1200);
                    });
                });
            });

            button.on('pointerover', () => {
                button.setStyle({ fontSize: '28px', fill: '#00BBFF' }); // Cor amarela ao passar o mouse
                this.hover.play();
            });
            button.on('pointerout', () => {
                button.setStyle({ fontSize: '24px', fill: '#fff' }); // Restaura a cor original ao retirar o mouse
            });
        });
    }

    checkScreen() {
        const larguraAtual = this.game.canvas.width;
        const alturaAtual = this.game.canvas.height;

        if (this.larguraAnterior !== larguraAtual || this.alturaAnterior !== alturaAtual) {
            // O tamanho da tela foi alterado, chame o método resize() para ajustar os elementos da cena
            this.resize(larguraAtual, alturaAtual);

            // Atualize as variáveis de largura e altura anteriores
            this.larguraAnterior = larguraAtual;
            this.alturaAnterior = alturaAtual;
        }
    }

    ajustarElementos(larguraTela, alturaTela) {
        this.bgImage.setDisplaySize(larguraTela, alturaTela);
        this.personagem.setDisplaySize(larguraTela-(larguraTela*0.5), alturaTela);
        this.personagem.setPosition(larguraTela / 2, alturaTela/1.5);

        if(this.dialogueBoxAnimated == true) {
            this.dialogueBox.setDisplaySize(larguraTela*2, (alturaTela/100)*30);
            this.dialogueBox.setPosition(0, alturaTela/1.3);
            this.beginnerOption.setPosition(larguraTela*0.2, alturaTela*0.8);
            this.intermediaryOption.setPosition(larguraTela*0.5, alturaTela*0.8);
            this.advancedOption.setPosition(larguraTela*0.8, alturaTela*0.8);
            this.textTitle.setPosition(game.canvas.width*0.5, game.canvas.height*0.7);
        }

        if(larguraTela < 500) {
             // Ajuste os elementos, incluindo os tamanhos dos textos
            if (this.textTitle) this.textTitle.setFontSize(18);
            if (this.beginnerOption) this.beginnerOption.setFontSize(18);
            if (this.intermediaryOption) this.intermediaryOption.setFontSize(18);
            if (this.advancedOption) this.advancedOption.setFontSize(18);
        } else {
            if (this.textTitle) this.textTitle.setFontSize(24);
            if (this.beginnerOption) this.beginnerOption.setFontSize(24);
            if (this.intermediaryOption) this.intermediaryOption.setFontSize(24);
            if (this.advancedOption) this.advancedOption.setFontSize(24);
        }
    }

    resize(larguraTela, alturaTela) {
        // Redimensione os elementos da cena quando o tamanho da tela for alterado
        this.ajustarElementos(larguraTela, alturaTela);
    }
}