import { Storage } from 'aws-amplify';

import { AmplifyS3Image } from '@aws-amplify/ui-react';
import React from 'react';


class CollectionItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []

        };

    }

    foldername = this.props.match.params.name.replace('-', ' ',)


    fetchKeys() {

        Storage.list('Collections/' + this.foldername)
            .then((results) => {
                console.log('test fetch keys')
                this.setState({ list: results })
            })

        console.log(this.state.list)


    }


    componentDidMount() {
        this.fetchKeys();



    }




    render() {




        return (
            <div class='page'>
                <div class='main-content'>
                    <div class='gallery'>
                        {


                            this.state.list.map((listname, i) => (


                                <div key={listname.key}>
                                    <AmplifyS3Image imgKey={listname.key}  />
                                </div>








                            ))

                        }
                    </div>
                </div>



            </div>
        )
    }
}
export default CollectionItem;