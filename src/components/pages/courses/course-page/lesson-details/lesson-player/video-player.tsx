import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react"
import { PlyrLayout, plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr"

type VideoPlayerProps = {
    videoId: string;
    autoplay: boolean;
    onEnd?: () => void;

}

const VideoPlayer = ({ videoId, autoplay, onEnd }: VideoPlayerProps) => {

    const userAlreadyInteracted = navigator.userActivation?.hasBeenActive

    return (
        <MediaPlayer title="Video da Aula"
            src={`youtube/${videoId}`}
            onEnded={onEnd}
            autoPlay={autoplay && userAlreadyInteracted}
        >


            <MediaProvider />
            <PlyrLayout icons={plyrLayoutIcons} />
            <source src={`https://www.youtube.com/watch?v=${videoId}`} />

        </MediaPlayer>
    )
}

export default VideoPlayer;