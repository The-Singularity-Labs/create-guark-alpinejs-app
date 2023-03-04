const MyPillComponent = () => ({
    show: false,
    bind: {
        ['x-html']() { return /*html*/`
        <div>
            <button
            :class="button_class",
            @click="show = !show"
            x-text="show ? 'Return ' + pill_name + ' Pill' : 'Take ' + pill_name + ' Pill' ">
            </button>
            <div x-show="show">
            <figure class="--flex-grow">
			    <img :src="url" :alt="alt">
			    <figcaption x-text="caption">Figure Caption</figcaption>
            </figure>
            </div>
        </div>
        `},
    },
});

export default MyPillComponent;