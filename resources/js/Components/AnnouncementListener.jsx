import React from "react";
import { useInterval } from "./useInterval";
import { enqueueSnackbar } from "./AppNotistack";
import AnnouncementContainer from "./AnnouncementContainer";
import { usePage } from "@inertiajs/react";
import { useEchoListener } from "./appEcho";

const dispatchMessage = (message, header = null) => enqueueSnackbar(<AnnouncementContainer header={header}>{message}</AnnouncementContainer>);

export default function AnnouncementListener(){
  const { auth } = usePage().props;

  useEchoListener({
    channel: `private-message.${auth.user.id}`,
    event: 'PrivateMessageEvent',
    callback: (e) => {
      dispatchMessage(e.message, 'Private Message');
    },
    isPrivate: true
  });

  useEchoListener({
    channel: 'announcement-channel',
    event: 'AnnouncementEvent',
    callback: (e) => {
      dispatchMessage(e.message, 'Announcement');
    }
  });

  /**
   * TODO test only
   */
  // function generateRandomHash() {
  //   return Math.random().toString(36).substring(2, 6);
  // }
  // useInterval(() => {
  //   const body = `TEST - i have been uncommented: ${generateRandomHash()}`;

  //   enqueueSnackbar(<AnnouncementContainer header="la kwa" footer="00:00">{body}</AnnouncementContainer>);
  // }, 2000)
}