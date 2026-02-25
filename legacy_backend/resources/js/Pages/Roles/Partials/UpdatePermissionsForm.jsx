import { Link, usePage } from '@inertiajs/react';
import { IconButton, Link as MUILink, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import SearchableList from '@/Components/SearchableList';
import DeleteIcon from '@mui/icons-material/Delete';
import Suggestions from '@/Components/Suggestions';
import { useEffect, useState } from 'react';

export function useSuggestions(searchTerm) {
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    async function fetchLatestSuggestions() {
      const response = await axios.post(route('permissions.search', {
        keyword: searchTerm,
      }));

      setSuggested(response.data);
    }

    fetchLatestSuggestions();
  }, [searchTerm]);

  return suggested;
};

const ItemNotFoundPlaceholder = ({roleName, searchTerm}) => {
  return <span>Add{' '}
    <AddPermissionToRoleLink roleName={roleName} permissionName={searchTerm} />{' '}to {roleName}.{' '}
    <Suggestions searchTerm={searchTerm}
      useSuggestions={useSuggestions}
      SuggestionWrapper={(({ suggestion }) => <MUILink component={Link}
          href={route('permissions.givePermissionToRole', {
            permissionName: suggestion,
            role: roleName
          })}
          method='post'
          underline='hover'
        >{suggestion}</MUILink>
      )}
      />
  </span>
}

const AddPermissionToRoleLink = ({ roleName, permissionName }) => {
  return <MUILink component={Link}
    href={route('permissions.givePermissionToRole', {
      permissionName,
      role: roleName
    })}
    method='post'
    underline='hover'
    >{permissionName}</MUILink>
}

const RemovePermissionFromRoleLink = ({ roleName, permissionName }) => {
  return <IconButton component={Link}
    href={route('permissions.removePermissionFromRole', {
      permission: permissionName,
      role: roleName
    })}
    method='post'
    size='small'
    title={`remove ${permissionName} from ${roleName}`}
  ><DeleteIcon /></IconButton>
}

export default function UpdatePermissionsForm({ className = 'max-w-xl' }) {
  const role = usePage().props.role;

  return (
    <section className={className}>
      <header>
        <Typography variant='h2' fontSize={18}>Permissions</Typography>
        <Typography paragraph variant='body2' color={grey[600]}>Add or Remove permissions from Role</Typography>
      </header>

      <div className="mt-6 space-y-6">
        <SearchableList
          height="250px"
          data={role.permissions.map(permissionObject => permissionObject.name)}
          ItemNotFoundPlaceholder={(({searchTerm}) => <ItemNotFoundPlaceholder
            roleName={role.name} searchTerm={searchTerm} />)}
          SecondaryActionPlaceholder={({item}) => <RemovePermissionFromRoleLink
            roleName={role.name} permissionName={item} />}
          ListEmptyPlaceholder={() => <Typography color={grey[500]}
            fontStyle='italic'>no permissions assigned to {role.name}</Typography>}
        />
      </div>
    </section>
  );
}
