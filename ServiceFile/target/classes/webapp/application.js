const UUID_LENGTH=36;

class FileInfo {
    constructor(fileName, size=0, createdAt=new Date()) {
        this.fileName = fileName;
        this.size = size;
        this.createdAt = createdAt;
    }

    realName() {
        return this.fileName.substring(UUID_LENGTH);
    }

   sizeFile() {
        let kbs = Math.ceil(this.size / 1024);

        let mbs = Math.ceil(this.size / (1024 * 1024));

        if (this.size < 1024) return `${this.size} Bytes`;

        if (this.size < (1024 * 1024)) return `${kbs} KB`;

        return `${mbs} MB`;
   }
}


class UploadService {

    constructor() {
    }

    
    onUploadSuccess(callback=null) {
        if (callback === null) {
            if (this._onUploadSuccess) this._onUploadSuccess();
        } else {
            this._onUploadSuccess = callback;
        }
    }

    onUploadFailed(callback=null) {
        if (callback === null) {
            if (this._onUploadFailed) this._onUploadFailed();
        } else {
            this._onUploadFailed = callback;
        }
    }

    upload(fileData, withAuth=false, token=null) {
        const formData = new FormData();
        const xhr = new XMLHttpRequest();
        const path = window.location + 'api/upload' + ('/up');

        formData.append('fileData', fileData);

        xhr.open('POST', path, true);


        xhr.onreadystatechange = (evt) => {
            const target = evt.target;

            if (target.readyState===4 && (target.status === 200 || target.status === 201)) {
                const data = JSON.parse(target.responseText) || {};

                return this.onUploadSuccess(data);

            } else if (target.readyState===4 && target.status != 200) {
                return this.onUploadFailed(target.responseText);
            }
        };

        xhr.send(formData);
    }
}

const App = React.createClass({

    getInitialState: function() {
        return {
            withAuth: false,
        }
    },

    componentDidMount: function() {

        this.setState({withAuth: !this.props.up});

        this.uploadService = new UploadService();

        this.uploadService.onUploadSuccess(this._onFileUploaded);

        this.uploadService.onUploadFailed((data) => console.log(data));
    },

    _onFileUploaded: function() {
        alert('Uploaded successfully');
    },

    onSubmit: function (evt) {
        evt.preventDefault();
        const fileData = this.refs.fileEl.files[0];
        if (this.state.withAuth) {
            var token = localStorage.getItem('dropwizardupload.token');
            return this.uploadService.upload(fileData, true, token);
        }

        this.uploadService.upload(fileData);

        return false;
    },

    render: function() {
       const title1 =  'Upload your file'; 
        return (
          <div className="wrapper">
            {title1}
            <form method="post" onSubmit={this.onSubmit}>
              <label>File Transfert</label>
              <input type="file" name="fileData" className="form-control" ref="fileEl" />
              <button>Upload</button>
            </form>
          </div>
        );
    }
});



const UploadedFilesInfoApp = React.createClass({

    getInitialState: function() {
        return {
            files: [],
        }
    },

    componentDidMount: function() {
        this.refresh();
        setInterval(() => this.refresh.call(this, null), 5000);
    },

    refresh: function() {
        const xhr = new XMLHttpRequest();
        const path = window.location + 'api/upload';

        xhr.open('GET', path, true);

        xhr.onreadystatechange = (evt) => {
            const target = evt.target;
            if (target.readyState === 4 && target.status === 200) {
                const data = JSON.parse(target.responseText);

                const datafiles = data.files.map((f) => new FileInfo(f.fileName, f.size));

                this.setState({ files: datafiles });

                this.render();

                return data;
            }
            if (target.readyState == 4 && target.status !== 200) {
                console.log('Failed to load files');
            }
            return false;
        };

        xhr.send();

        return false;
    },

     render: function() {
        
        this.uploadService = new UploadService();

        const children = this.state
            .files
            .map((f) => <li><a href={'#/' + f.fileName} title={f.fileName}>{f.realName()} (<small>{f.sizeFile()}</small>)</a>
            <button> Download</button></li>);

        return (
          <div className="wrapper">
            <h2>Uploaded Files</h2>
            <ul>
              {children}
            </ul>
          </div>
        );
    }
});


ReactDOM.render(
    <App up={true} />,
    document.querySelector('#uploadApplicationUp')
);

ReactDOM.render(
    <UploadedFilesInfoApp />,
    document.querySelector('#uploadedFilesInfo')
);