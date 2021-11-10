


export default class TestData {


    static get memories() {
        let data = []

        // for (let i = 0; i < 20; i++) {
        //     data.push(this.getMemory(i))
        // }

        return {
            success: true,
            data
        }
    }

    // static getImageUrl() {
    //     let images = [
    //         "https://images.pexels.com/photos/3998177/pexels-photo-3998177.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //         "https://images.pexels.com/photos/3853501/pexels-photo-3853501.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //         "https://images.pexels.com/photos/3848484/pexels-photo-3848484.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //         "https://images.pexels.com/photos/3597060/pexels-photo-3597060.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //         "https://images.pexels.com/photos/4033935/pexels-photo-4033935.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //         "https://images.pexels.com/photos/4064432/pexels-photo-4064432.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //         "https://images.pexels.com/photos/4064693/pexels-photo-4064693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
    //     ]
    //     let index = Math.round(Math.random() * (images.length - 1));
    //     return images[index];
    // }

    static getMemory(id) {
        return null
        // return {
        //     id: `${id}`,
        //     ownerId: `${id}`,
        //     caption: `Memory ${id}`,
        //     description: `The image source (either a remote URL or a local file resource). This prop can also contain several remote URLs, specified together with their width and height and potentially with scale/other URI arguments. The native side will then choose the best uri to display based on the measured size of the image container. A cache property can be added to control how networked request interacts with the local cache. (For more information see Cache Control for Images). The currently supported formats are png, jpg, jpeg, bmp, gif, webp (Android only), psd (iOS only). In addition, iOS supports several RAW image formats. Refer to Apple's documentation for the current list of supported camera model`,
        //     eventDate: '31-03-2020',
        //     createdAt: '31-03-2020',
        //     updatedAt: '31-03-2020',
        //     items: [
        //         {
        //             type: "PICTURE",
        //             fileId: "1",
        //             url: this.getImageUrl(),
        //             coordinates: []
        //         },
        //         {
        //             type: "PICTURE",
        //             fileId: "1",
        //             url: this.getImageUrl(),
        //             coordinates: []
        //         },
        //         {
        //             type: "PICTURE",
        //             fileId: "1",
        //             url: this.getImageUrl(),
        //             coordinates: []
        //         },
        //         {
        //             type: "PICTURE",
        //             fileId: "1",
        //             url: this.getImageUrl(),
        //             coordinates: []
        //         }
        //     ],
        //     coordinates: [],
        //     tags: ["1", "2"]
        // }
    }

    static makeEmptyMemory() {
        return {
            id: null,
            ownerId: null,
            caption: ``,
            description: ``,
            // eventDate: '31-03-2020',
            // createdAt: '31-03-2020',
            // updatedAt: '31-03-2020',
            items: [],
            // items: [
            //     {
            //         type: "PICTURE",
            //         fileId: "1",
            //         url: this.getImageUrl(),
            //         coordinates: []
            //     },
            //     {
            //         type: "PICTURE",
            //         fileId: "1",
            //         url: this.getImageUrl(),
            //         coordinates: []
            //     },
            //     {
            //         type: "PICTURE",
            //         fileId: "1",
            //         url: this.getImageUrl(),
            //         coordinates: []
            //     },
            //     {
            //         type: "PICTURE",
            //         fileId: "1",
            //         url: this.getImageUrl(),
            //         coordinates: []
            //     }
            // ],
            coordinates: [],
            tags: []
        }
    }

}