<template>
  <article class="message is-warning">
    <div class="message-header">
      <p>Please keep in mind the following items:</p>
    </div>
    <div class="message-body">
      <ol>
        <li>
          <strong>Last Name</strong>, <strong>Middle Name</strong>,
          <strong>First Name</strong> and <strong>Company</strong> fields are
          <strong>required</strong>. This is
          <strong>used by the system to generate folders</strong>. If a patient
          has no company, you can just put a random company name.
        </li>
        <li>
          <strong>ALL OTHER FIELDS ARE OPTIONAL.</strong> You can decide not to
          put values on them.
        </li>
        <li>
          Deleting a patient will only have the system delete
          <strong>the patient's folder</strong>. It is up to your discretion
          whether to manually delete the company folder or not.
        </li>
        <li>
          Please <strong>do not manually delete a patient's folder</strong>.
          This might cause the system to break. Delete the patient using the
          system itself.
        </li>
        <li>
          Generating patient results will
          <strong>automatically generate four files</strong>: one for AIO,
          BloodChem, PhysicalExam and XRay. Do not worry about the other files,
          you can simply ignore them and not print them.
        </li>
        <li>
          Please try to limit the number of batch import rows to
          <strong>30</strong>
        </li>
        <li>
          If the page becomes laggy for some reason, try doing a page refresh.
          If that doesn't help, reboot the computer and start the system again.
        </li>
      </ol>
    </div>
  </article>
</template>

<script>
export default {
  name: 'SystemMessage',
}
</script>

<style scoped></style>
