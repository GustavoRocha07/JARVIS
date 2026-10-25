export const playSound = (src: string): HTMLAudioElement => {
    const audio = new Audio(src);

    audio.loop = true;

    void audio.play().catch((error: unknown) => {
        console.warn("Não foi possível reproduzir o som:", error);
    });

    return audio;
};

export const stopSound = (audio: HTMLAudioElement): void => {
    audio.pause();
    audio.currentTime = 0;
};