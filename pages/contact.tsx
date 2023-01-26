import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

export const getStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', [
      'common',
    ])),
  },
})

const Contact = () => {
  return (
    <div className="center">
      <h2>Contact Page</h2>
    </div>
  );
};
export default Contact;