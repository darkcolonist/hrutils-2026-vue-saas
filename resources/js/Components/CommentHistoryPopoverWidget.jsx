import React from 'react';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { Badge, Box, Divider, IconButton, Paper, Popover, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AxiosWrapper from './AxiosWrapper';
import { usePage } from '@inertiajs/react';
import moment from 'moment/moment';
import RealtimeTimestamp from './RealtimeTimestamp';

const CommentItem = ({ backgroundComment }) => {
  const { formats } = usePage().props;
  const timestamp = backgroundComment.timestamp
    ? moment(backgroundComment.timestamp).format(formats.dates.front_end_moment_human)
    : "pending";

  return <React.Fragment>
    <span style={{
      marginLeft: "10px"
      , textIndent: "-10px"
    }}>
      <Typography
        component='span'
        sx={{
          ...(
            backgroundComment.timestamp == null
              ? {
                opacity: .2,
                fontStyle: "italic"
              }
              : {}
          ),
          ...{
            /**
             * add more options as needed
             */
          }
        }}
      >{backgroundComment.comment}</Typography>

      {backgroundComment.timestamp
        ? <RealtimeTimestamp
            sx={{
              ml: .5,
              opacity: .2,
              fontSize: '.7em'
            }}
            titleDisplayFormat={formats.dates.front_end_moment_human}>
            {backgroundComment.timestamp}
          </RealtimeTimestamp>
        : null}
    </span>
  </React.Fragment>
};

const CommentList = ({backgroundComments, ...props}) => {
  return <Stack divider={<Divider />}
    sx={{
        py: .5
        , px: 1
        , height: "200px"
        , width: "300px"
        , overflowY: "scroll"
        , flexDirection: "column-reverse"
      }}
    >
    {backgroundComments.map((backgroundComment, index) =>
      <CommentItem key={index}
        {...{
          backgroundComment,
          index
        }} />
    )}
  </Stack>
}

export default function CommentHistoryPopoverWidget({ email, ...props }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commentCount,setCommentCount] = React.useState(0);
  const [comments,setComments] = React.useState([]);
  const [textFieldCommentValue,setTextFieldCommentValue] = React.useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if(textFieldCommentValue.trim() === '')
      return;

    const newComment = {
      index: comments.length,
      timestamp: null,
      comment: textFieldCommentValue.trim()
    };

    addComment(newComment);

    (async function (){
      const response = await axios.post(
        route('background.check.comments.submit', {
          email: email,
          comment: textFieldCommentValue
        })
      );

      const updatedComment = { ...newComment, ...response.data };
      updateComment(updatedComment);
    })()

    setTextFieldCommentValue('');
  }

  const updateComment = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.index === updatedComment.index ? updatedComment : comment
      )
    )
  }

  const addComment = commentObject => {
    setComments(comments => {
      const updatedComments = [commentObject, ...comments];
      setCommentCount(updatedComments.length);
      return updatedComments;
    })
  }


  const handleTextFieldCommentValueChange = event =>
    setTextFieldCommentValue(event.target.value);

  const open = Boolean(anchorEl);
  const id = open ? 'comment-history-popover' : undefined;

  return (
    <>
      <IconButton aria-label="delete" size="small" onClick={handleClick}
        title='view additional comments'>
        <Badge badgeContent={commentCount} color='primary'>
          <SpeakerNotesIcon fontSize="inherit" />
        </Badge>
        <AxiosWrapper method="post"
          routeName='background.check.comments'
          params={{
            email: email
          }}

          /** disable JSONView renderer */
          after={data => null}

          afterCallback={data => {
            data.list.map((backgroundComment) => {
              addComment(backgroundComment);
            });
          }}
        />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{p:1}}>
          <Box component={Paper}>
            {commentCount < 1
              ? <Typography
                  sx={{
                    opacity: .3,
                    lineHeight: 10
                  }}
                  align='center'>no additional comments yet</Typography>
              : <CommentList backgroundComments={comments} />
            }
          </Box>

          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              value={textFieldCommentValue ?? ''}
              onChange={handleTextFieldCommentValueChange}
              fullWidth
              size='small'
              InputProps={{
                endAdornment: <IconButton aria-label="delete" size="small" onClick={handleSubmit}
                  title='send'>
                  <SendIcon fontSize="inherit" />
                </IconButton>
              }}
            />
          </Box>
        </Box>
      </Popover>
    </>
  );
}