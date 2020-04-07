import React, { Component } from 'react';
import { Link } from 'react-router';
import { getToken, removeUserSession } from './users/Helper';
import InputField from './InputField';
import TextArea from './TextArea';
import SubmitButton from './SubmitButton';

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: {
                data: []
            }
        }
    }

    async componentDidMount() {

        const token = getToken();

        try {
            if (!token) {
                this.props.router.push("/");
                alert('You\'re not logged in. Back to login page');
            }
            let res = await fetch('http://localhost:4200/api/v1/get-all-items', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            });

            let result = await res.json();
            this.setState({
                result: {
                    data: result.data
                },
                token: token
            })

        } catch (error) {
            console.log(error);
        }
    }

    renderPosts() {
        return this.state.result.data.map((post) => {
            let isImageUrl = (string) => {
                let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
                return (res !== null)
            };

            let feedContent = post.feed;
            if (isImageUrl(feedContent)) {
                feedContent = <img className="media-object" src={feedContent} alt="img-thumbnail" />;
            } else {
                feedContent = `${feedContent.slice(0, 25)}...`;
            }
            return (
                <li className="list-group-item" key={post.feed_id}>
                    <h2><strong>{post.title}</strong></h2>
                    <h5 className="content"> {feedContent} </h5>
                    <span className="date">Posted On: {post.modifiedon} </span>
                    <Link onClick={()=> this.exportFeedId()} to={`posts/${post.feed_id}`}
                    className="content">View full </Link>
                </li>
            )
        })
    }

    setInputValue(proerty, val) {
        this.setState({
            [proerty]: val
        })
    }

    resetForm() {
        this.setState({
            title: '',
            article: '',
            buttonDisabled: false
        })
    }

    async handlePostNew() {
        const token = this.state.token

        if (!this.state.title) {
            return;
        }
        if (!this.state.article) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch('http://localhost:4200/api/v1/post/articles', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify(this.state)
            });

            console.log('Token:', token);

            let result = await res.json();
            console.log('Post result:', result);
            this.resetForm();

            if(!result.status && result.status !== 'success') {
                alert(result.message);
            }

        } catch (error) {
            console.log(error);
            this.resetForm();
        }
    }

    handleLogout = () => {
        removeUserSession();
        this.props.router.push("/");
    }

    render() {
        return (
            <div>
                <div className="list-group-item">
                    <h2>WELCOME TO TEAM</h2>
                    <h4>View Posts by fellow staff</h4>
                </div>
                <div className="list-group-item">
                    <InputField className="inputField" type="text" placeholder="Title" value={this.state.title ? this.state.title : ''}
                        onChange={(val) => this.setInputValue('title', val)}
                    />
                    <TextArea className="inputField" type="text" placeholder="Write something to fellow staff" value={this.state.article ? this.state.article : ''}
                        onChange={(val) => this.setInputValue('article', val)}
                    />

                    <SubmitButton className="btn-post" text="Post" onClick={() => this.handlePostNew()}
                    />
                </div>
                <div className="posts">
                    <ul className="list-group">
                        {this.renderPosts()}
                    </ul>
                </div>

                <SubmitButton className="btn-logout" text="Sign out" onClick={() => this.handleLogout()}
                />
            </div>
        );
    }
};

export default Post;