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

class Downloadservice{
    constructor(){

    }
    onDownloadSucces(callback=null){
        if(collback===null){
            if(this._onDownloadSuccess){
                this._onDownloadSuccess();
            }
        }else{
            this._onDownloadSuccess=callback;
        }
    }

        onDownloadFailed(callback=null){
        if(collback===null){
            if(this.onDownloadFailed){
                this._onDownloadSuccess();
            }
        }else{
            this.onDownloadFailed=callback;
        }
    }

    download(filename){
        const formData1 = new FormData();
        const xhr1 = new XMLHttpRequest();
        const path1 = window.location + 'api/uploads/downloads' + ('/down');

        formData1.append('filename',filename);
        xhr1.open('POST',path1,true);

        xhr1.onreadystatechange =(evt)=>{
            const target = evt.target;

            if (target.readyState===4 && (target.status === 200 || target.status === 201)) {
                const data = JSON.parse(target.responseText) || {};

                return this.onUploadSuccess(data);

            } else if (target.readyState===4 && target.status != 200) {
                return this.onUploadFailed(target.responseText);
            }
        }
        xhr1.send(formData1);
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

    upload(fileData) {
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
        const fileData = this.refs.f1.files[0];
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
              <input type="file" name="fileData" className="form-control" ref="f1" />
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
        setInterval(() => this.refresh.call(this, null), 500);
    },

    onDonwload : function(evt,url){
        evt.preventDefault();
        const filename = url;
        this.Downloadservice(filename);
        return false;
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