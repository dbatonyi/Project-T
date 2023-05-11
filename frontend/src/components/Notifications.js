import React, { useEffect, useState } from "react";
import configData from "../../config";
import useTranslation from "next-translate/useTranslation";

import InviteCard from "./InviteCard";

const Notifications = ({ userInfo, setStatusMessage }) => {
  const { t } = useTranslation("notifications");
  const [reRender, setReRender] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await fetch(
          `${configData.serverUrl}/api/get-invites-list`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authenticate: `Bearer ${configData.apiToken}`,
            },
            credentials: "include",
            body: JSON.stringify({
              userUuid: userInfo.uuid,
            }),
          }
        );
      } catch (error) {
        const log = await fetch(`${configData.serverUrl}/api/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authenticate: `Bearer ${configData.apiToken}`,
          },
          credentials: "include",
          body: JSON.stringify({
            log: error,
          }),
        });
        const data = await log.json();
        setStatusMessage(data.message);
      }
    };

    fetchInvites();
  }, [reRender]);

  return (
    <div className="notifications">
      <div
        className="notifications__controller"
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        {t("notificationsTitle")}
        <svg
          fill="#000000"
          height="800px"
          width="800px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
        >
          <g>
            <g>
              <path
                d="M439.652,347.915v-97.48c0-85.797-59.14-158.031-138.794-178.101c3.34-6.707,5.229-14.258,5.229-22.246
			C306.087,22.469,283.618,0,256,0c-27.618,0-50.087,22.469-50.087,50.087c0,7.988,1.889,15.539,5.229,22.246
			c-79.654,20.07-138.794,92.305-138.794,178.101v97.48c-19.433,6.892-33.391,25.45-33.391,47.215
			c0,27.618,22.469,50.087,50.087,50.087h85.158C181.957,483.275,215.686,512,256,512s74.042-28.725,81.799-66.783h85.158
			c27.618,0,50.087-22.469,50.087-50.087C473.043,373.365,459.085,354.807,439.652,347.915z M256,33.391
			c9.206,0,16.696,7.49,16.696,16.696S265.206,66.783,256,66.783c-9.206,0-16.696-7.49-16.696-16.696S246.794,33.391,256,33.391z
			 M256,478.609c-21.766,0-40.323-14.07-47.215-33.503h94.431C296.323,464.539,277.766,478.609,256,478.609z M422.957,411.826
			H89.044c-9.206,0-16.696-7.49-16.696-16.696s7.49-16.696,16.696-16.696h33.392c9.22,0,16.696-7.475,16.696-16.696
			s-7.475-16.696-16.696-16.696h-16.697v-94.609c0-82.854,67.407-150.261,150.261-150.261s150.261,67.407,150.261,150.261v94.609
			h-16.71c-9.22,0-16.696,7.475-16.696,16.696s7.475,16.696,16.696,16.696h33.406c9.206,0,16.696,7.49,16.696,16.696
			S432.162,411.826,422.957,411.826z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M256,133.565c-64.442,0-116.87,52.428-116.87,116.87c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696
			c0-46.03,37.448-83.478,83.478-83.478c9.22,0,16.696-7.475,16.696-16.696S265.22,133.565,256,133.565z"
              />
            </g>
          </g>
        </svg>
      </div>
      {showDropdown ? (
        <div className="notifications__list">
          {notifications.length > 0 ? (
            <>
              {notifications.map((item, index) => (
                <InviteCard
                  notificationsData={item}
                  reRender={reRender}
                  setReRender={setReRender}
                  key={index}
                />
              ))}
            </>
          ) : (
            <div className="no-result">{t("notificationsNoResult")}</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Notifications;
