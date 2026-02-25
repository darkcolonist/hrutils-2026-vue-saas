import React from 'react';
import { router, Link } from '@inertiajs/react';
import { Alert, Avatar, Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import UserProfileGroup from './Partials/UserProfileGroup';
import Suggestions, { getBackgroundCheckRoute, getDisplayName } from './Partials/Suggestions';
import ButtonIconDialog from '@/Components/ButtonIconDialog';
import { debounce } from '@/Helpers/Debounce';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const searchStringIsValid = (searchString) => {
  if (searchString === null || searchString === undefined)
    return false;

  if (typeof searchString === 'string' || searchString instanceof String)
    return searchString.trim().length > 2;

  return true;
}

const fetchSuggestions = async (keyword) => {
  const results = await axios.post(route('background.find'), {
    keyword
  });

  return results.data;
}

const DialogSuggestionsContent = ({users, ...props}) => {
  const SuggestionLine = ({user, ...props}) => {
    return <Button href={getBackgroundCheckRoute(user)}
      component={Link} sx={{
        justifyContent: "flex-start"
        , textTransform: "inherit"
      }}>
        <Avatar src={user.avatarURL} sx={{
          width: 32,
          height: 32,
          mr: 1
        }}/>
        <Stack divider={<Divider />}>
          <span>
            {user.status === "active"
              ? <CheckCircleIcon color='success' sx={{
                width: 12,
                height: 12,
                mr: .5
              }}/>
            : <CancelIcon color='disabled' sx={{
                width: 12,
                height: 12,
                mr: .5
              }} />}
            <Typography variant='span' fontSize={18}>{getDisplayName(user)}</Typography>
          </span>
          <span>{user.department}</span>
        </Stack>
      </Button>
  };

  return <React.Fragment>
    <Stack spacing={.3} sx={{
      maxHeight: 200
    }}>
      {users.map((user, userKey) =>
        <SuggestionLine key={userKey} user={user} />)}
    </Stack>
  </React.Fragment>
};

const SuggestionsButtonIconDialog = ({
  searchString = ''
  , ...props}) =>
{
  const [dialogContent,setDialogContent] = React.useState('none yet');
  const [buttonIconDialogIsVisible,setButtonIconDialogIsVisible] = React.useState(false);
  const [suggestionsCount,setSuggestionsCount] = React.useState(0);

  const debouncedSetDialogContent = React.useCallback(
    debounce(async (value) => {
      if(value === null)
        return;

      setButtonIconDialogIsVisible(false);

      const suggestions = await fetchSuggestions(value);

      if(suggestions.users.length){
        setSuggestionsCount(suggestions.users.length)
        setDialogContent(<DialogSuggestionsContent
          users={suggestions.users}
        />);
        setButtonIconDialogIsVisible(true);
      }
    })
  , []);

  React.useEffect(() => {
    if(searchStringIsValid(searchString))
      debouncedSetDialogContent(searchString);
    else
      debouncedSetDialogContent(null);
  },[searchString]);

  return <ButtonIconDialog
    count={suggestionsCount}
    isVisible={buttonIconDialogIsVisible}>
      {dialogContent}
    </ButtonIconDialog>
};

export default function BackgroundCheck({ auth, keyword, response, formats }) {
  const [searchString, setSearchString] = React.useState(keyword);
  const [suggestionSearchString,setSuggestionSearchString] = React.useState(null);
  const searchBoxRef = React.useRef(null);

  React.useEffect(() => {
    searchBoxRef.current && searchBoxRef.current.focus();
  },[]);

  function handleFormSubmit(event) {
    event.preventDefault();

    if(searchString === keyword) return;

    router.visit(route('background.check', {
      keyword: searchString
    }))
  }

  return <AuthenticatedSectionLayout auth={auth} title="Background Check">
    <Box sx={{ p: 2 }}>
      {response.errors && response.errors.length ?
        <Alert severity="error">
          {response.errors.map((error, index) =>
            <Typography key={index} variant='body2'>{error}</Typography>)}
        </Alert> : null}
      <Box sx={{
        my: 1,
        display: 'flex',
        alignItems: 'center',
      }} component='form' onSubmit={handleFormSubmit}>
        <TextField
          placeholder='Search'
          autoComplete="off"
          defaultValue={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);

            /**
             * because we only want suggestions to appear if the user
             *  has actually typed something. initial page load
             *  entails that a search is already being made and no
             *  suggestions are necessary at the time.
             */
            setSuggestionSearchString(e.target.value);
          }}
          inputRef={searchBoxRef}
        />

        <SuggestionsButtonIconDialog
          searchString={suggestionSearchString}
        />
      </Box>

      <Box sx={{my:1}}>
        <Suggestions formats={formats} />
      </Box>

      {(response.results && response.results.users)
        ? <Stack spacing={1}>
            {response.results.users.map((user, index) =>
              <UserProfileGroup user={user} key={index} />
            )}
          </Stack>
        : null}
    </Box>
  </AuthenticatedSectionLayout>
}
