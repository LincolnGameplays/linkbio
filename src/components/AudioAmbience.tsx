import { useEffect, useRef, useState } from 'react';

const AudioAmbience: React.FC = () => {
    const [isMuted, setIsMuted] = useState(true);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        // Initialize audio context on first user interaction
        const initAudio = () => {
            if (audioContextRef.current) return;

            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            // Create gain node for volume control
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            gainNode.connect(audioContext.destination);
            gainNodeRef.current = gainNode;

            // Create brown noise
            const bufferSize = 2 * audioContext.sampleRate;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let lastOut = 0.0;

            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // Amplify
            }

            const brownNoise = audioContext.createBufferSource();
            brownNoise.buffer = noiseBuffer;
            brownNoise.loop = true;

            // Filter for deeper sound
            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 200;

            brownNoise.connect(filter);
            filter.connect(gainNode);
            brownNoise.start(0);
            noiseNodeRef.current = brownNoise;

            // Add subtle crackle effect with oscillators
            const createCrackle = () => {
                if (!audioContextRef.current || !gainNodeRef.current) return;

                const osc = audioContextRef.current.createOscillator();
                const oscGain = audioContextRef.current.createGain();

                osc.type = 'square';
                osc.frequency.value = Math.random() * 100 + 50;
                oscGain.gain.value = 0.001;

                osc.connect(oscGain);
                oscGain.connect(gainNodeRef.current);

                osc.start();
                osc.stop(audioContextRef.current.currentTime + 0.05);

                oscillatorsRef.current.push(osc);
            };

            // Random crackle intervals
            const crackleInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    createCrackle();
                }
            }, 2000);

            return () => clearInterval(crackleInterval);
        };

        const handleInteraction = () => {
            initAudio();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);

            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const toggleMute = () => {
        if (!gainNodeRef.current || !audioContextRef.current) return;

        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        // Smooth fade in/out
        const currentTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(currentTime);
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(
            newMutedState ? 0 : 0.02,
            currentTime + 3
        );
    };

    return (
        <button
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan/50 transition-all duration-300 group"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                {isMuted ? '🔇' : '🔊'}
            </span>
        </button>
    );
};

export default AudioAmbience;
