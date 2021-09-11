import { Storage } from "aws-amplify";
import { listMediaFiles } from "../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { AmplifyS3Image } from "@aws-amplify/ui-react";
import React from "react";

class CollectionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  folderName = this.props.match.params.name.replace("-", " ");

  fetchKeys = async () => {
    const results = await API.graphql(
      graphqlOperation(listMediaFiles, {
        filter: { collection: { contains: this.folderName } },
      })
    );

    console.log(results);

    this.setState({ list: results.data.listMediaFiles.items });

    console.log("Collection item fetch");
  };

  componentDidMount() {
    this.fetchKeys();
  }

  render() {
    return (
      <div class="page">
        <div class="main-content">
          <div class="gallery">
            {this.state.list.map((listname, i) => (
              <div key={listname.key}>
                <AmplifyS3Image imgKey={listname.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default CollectionItem;
