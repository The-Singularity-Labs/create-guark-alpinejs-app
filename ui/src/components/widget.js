const MyImageWidget = () => ({
    show: false,
    bind: {
        ['x-html']() { return /*html*/`
        <div>
            <button
            class="-primary -medium"
            @click="show = !show"
            x-text="submit">
            </button>
            <div x-show="show">
            <figure class="--flex-grow">
			    <img :src="url": alt="caption">
			    <figcaption x-text="caption">Figure Caption</figcaption>
            </figure>
            </div>
        </div>
        `},
    },
});

export default MyImageWidget;